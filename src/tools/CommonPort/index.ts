import EventEmitter from 'events';
import { PortDeviceType } from '@/consts/ports';
import { delay } from '@/tools/delay';
import { findSubarray } from '@/tools/findSubarray';
import { appendUint8Arrays } from '@/tools/mergeReadResults';
import { ReadParams, ReadResult } from '@/types/ports';

const DETECT_PACKET_CAPTURE = 'GAMEBOY PRINTER Packet Capture';
const DETECT_PRINTER_EMULATOR = 'GAMEBOY PRINTER Emulator';
const DETECT_SUPER_PRINTER_INTERFACE = 'Super Printer Interface by Raphaël BOICHOT';

export abstract class CommonPort extends EventEmitter {
  protected portDeviceType: PortDeviceType;
  private readTimeoutDuration: number;
  private textDecoder: TextDecoder;
  private textEncoder: TextEncoder;
  private bufferedData: Uint8Array | null;
  private readQueue: Promise<void>;

  protected constructor() {
    super();
    this.portDeviceType = PortDeviceType.UNKNOWN;
    this.readTimeoutDuration = 1000;
    this.textDecoder = new TextDecoder();
    this.textEncoder = new TextEncoder();
    this.bufferedData = null;
    this.readQueue = Promise.resolve();
  }

  getPortDeviceType(): PortDeviceType {
    return this.portDeviceType;
  }

  protected abstract canRead(): boolean
  abstract getId(): string
  protected abstract readChunk(): Promise<Uint8Array>
  protected abstract sendRaw(data: BufferSource): Promise<void>

  protected startBuffering() {
    (async () => {
      /* eslint-disable no-await-in-loop */
      while (this.canRead()) {
        const result = await this.readChunk();
        if (result.byteLength) {
          this.bufferedData = this.bufferedData ? appendUint8Arrays(this.bufferedData, result) : result;
        } else {
          // console.log(this.textDecoder.decode(this.bufferedData as Uint8Array));
          await delay(150);
        }
      }
      /* eslint-enable no-await-in-loop */
    })();
  }

  private async readFromBuffer({ timeout, length, texts }: ReadParams): Promise<Uint8Array> {
    let sliceLength = typeof length === 'number' ? length : Infinity;
    let run = true;
    const idleDelay = 10;

    if (typeof timeout === 'number') {
      setTimeout(() => { run = false; }, timeout);
    }

    if (typeof length === 'number') {
      if (length === 0) { run = false; }
      try {
        /* eslint-disable no-await-in-loop */
        while (this.canRead() && run) {
          if (this.bufferedData && this.bufferedData.byteLength >= length) {
            run = false;
          } else {
            // give the app some idle time
            await delay(idleDelay);
          }
        }
        /* eslint-enable no-await-in-loop */
      } catch (error) {
        this.emit('error', (error as Error).message);
      }
    } else if (texts instanceof Array) {
      const needles: Uint8Array[] = texts.map((text) => this.textEncoder.encode(text));
      if (needles.length === 0) { run = false; }
      /* eslint-disable no-await-in-loop */
      while (this.canRead() && run) {
        if (this.bufferedData && this.bufferedData.byteLength) {
          const needleIndex = needles
            .map(needle => ({
              needle,
              index: findSubarray(this.bufferedData as Uint8Array, needle),
            }))
            .filter(r => (r.index !== -1))
            .sort((a, b) => (a.index - b.index))[0] ?? null;

          if (needleIndex) {
            sliceLength = needleIndex.index + needleIndex.needle.byteLength;
            run = false;
          } else {
            await delay(idleDelay);
          }
        } else {
          // give the app some idle time
          await delay(idleDelay);
        }
      }
      /* eslint-enable no-await-in-loop */
    } else {
      /* eslint-disable no-await-in-loop */
      while (this.canRead() && run) {
        await delay(idleDelay);
      }
      /* eslint-enable no-await-in-loop */
    }

    if (!this.bufferedData) {
      return new Uint8Array();
    }

    const result = this.bufferedData.slice(0, sliceLength);
    this.bufferedData = this.bufferedData.slice(sliceLength);
    return result;
  }

  public read(options: ReadParams): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve) => {
      this.readQueue = this.readQueue
        .then(() => this.readFromBuffer(options))
        .then(resolve);
    });
  }

  private detectActiveType(bytes: Uint8Array) {
    const detectString = this.textDecoder.decode(bytes);

    if (
      (detectString.indexOf(DETECT_PACKET_CAPTURE) !== -1) || // Raw Packet mode
      (detectString.indexOf(DETECT_PRINTER_EMULATOR) !== -1) // Hex encoded Tiles
    ) {
      // https://github.com/mofosyne/arduino-gameboy-printer-emulator/blob/master/GameBoyPrinterEmulator/GameBoyPrinterEmulator.ino
      this.portDeviceType = PortDeviceType.PACKET_CAPTURE;
      this.readTimeoutDuration = 100;
      this.emit('typechange');
    } else if (detectString.indexOf(DETECT_SUPER_PRINTER_INTERFACE) !== -1) {
      // https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/blob/main/Super_Printer_interface/Super_Printer_interface.ino
      this.portDeviceType = PortDeviceType.SUPER_PRINTER_INTERFACE;
      this.readTimeoutDuration = 10;
      this.emit('typechange');
    }
  };

  async send(data: BufferSource, readParamss: ReadParams[], flush: boolean): Promise<Uint8Array[]> {
    if (flush) {
      this.bufferedData = null;
    }

    // read length 0 -> this will resolve once all existing read calls are resolved
    const readReady = this.read({ length: 0 });
    // read actual result -> this will resolve with the requested data
    const readResults = readParamss.map((readParams) => this.read(readParams));

    await readReady; // Wait until our readResult is guaranteed to be next
    await this.sendRaw(data); // Send Data
    return Promise.all(readResults); // Resolve with read result
  }


  private emitData(bytes: Uint8Array) {
    // Dont emit if there's no content
    if (bytes.byteLength === 0) {
      return;
    }

    const emitReadResult: ReadResult = {
      string: this.textDecoder.decode(bytes),
      bytes: bytes,
      deviceId: this.getId(),
      portDeviceType: this.portDeviceType,
    };

    this.emit('data', emitReadResult);
  };

  async readLoop() {
    this.startBuffering();

    // the printer emulator takes about 3500ms to write it's banner, so we wait a bit longer to be safe
    const bannerBytes = await this.read({
      timeout: 5000,
      texts: [
        DETECT_PACKET_CAPTURE,
        DETECT_PRINTER_EMULATOR,
        DETECT_SUPER_PRINTER_INTERFACE,
      ],
    });

    this.detectActiveType(bannerBytes);

    if (this.portDeviceType !== PortDeviceType.UNKNOWN) {
      console.log('Known!');
      // A known device type was recognized -> clear buffer to remove "rest" of banner
      this.bufferedData = null;
    } else if (bannerBytes.byteLength) {
      console.log('Unknown with Banner!');
      // Banner was received, but device type was not not recognized
      this.emitData(bannerBytes);
      this.portDeviceType = PortDeviceType.INACTIVE;
      this.emit('typechange');
    } else {
      // Unknown device type and no banner. Try to detect a "passive" device
      const [readCrLf] = await this.send(new Uint8Array([0x0d, 0x0a]), [{ timeout: 500 }], true); // cr/lf
      if (readCrLf.byteLength) {
        this.emitData(readCrLf);
      }

      const [readGBX] = await this.send(new Uint8Array([0xa1]), [{ timeout: 500 }], true); // Query GBXCart Version
      this.emitData(readGBX);

      this.portDeviceType = PortDeviceType.INACTIVE;
      this.emit('typechange');
    }

    if (this.portDeviceType === PortDeviceType.INACTIVE) {
      return;
    }

    // enter the read-loop
    try {
      /* eslint-disable no-await-in-loop */
      while (this.canRead()) {
        const result: Uint8Array = await this.read({ timeout: this.readTimeoutDuration });
        if (result.byteLength) {
          // console.log('received through readloop', this.textDecoder.decode(result));
          this.emit('receiving');
          this.emitData(result);
        }
      }
      /* eslint-enable no-await-in-loop */
    } catch (error) {
      this.emit('error', (error as Error).message);
    }
  }
}
