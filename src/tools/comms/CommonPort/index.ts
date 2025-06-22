import EventEmitter from 'events';
import { PortDeviceType, PortType } from '@/consts/ports';
import { appendUint8Arrays } from '@/tools/appendUint8Arrays';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import { InactiveCommsDevice } from '@/tools/comms/DeviceAPIs/InactiveCommsDevice';
import { SuperPrinterCommsDevice } from '@/tools/comms/DeviceAPIs/SuperPrinterCommsDevice';
import { delay } from '@/tools/delay';
import { findSubarray } from '@/tools/findSubarray';
import { ReadParams } from '@/types/ports';

const DETECT_PACKET_CAPTURE = 'GAMEBOY PRINTER Packet Capture';
const DETECT_PRINTER_EMULATOR = 'GAMEBOY PRINTER Emulator';
const DETECT_SUPER_PRINTER_INTERFACE = 'Super Printer Interface by Raphaël BOICHOT';

export abstract class CommonPort extends EventEmitter {
  public readonly portType: PortType;
  public portDeviceType: PortDeviceType;
  private textDecoder: TextDecoder;
  private textEncoder: TextEncoder;
  private bufferedData: Uint8Array | null;
  private readQueue: Promise<void>;

  protected constructor(portType: PortType) {
    super();
    this.portDeviceType = PortDeviceType.UNKNOWN;
    this.portType = portType;
    this.textDecoder = new TextDecoder();
    this.textEncoder = new TextEncoder();
    this.bufferedData = null;
    this.readQueue = Promise.resolve();
  }

  abstract canRead(): boolean;
  protected abstract readChunk(): Promise<Uint8Array>;
  protected abstract sendRaw(data: BufferSource): Promise<void>;
  abstract getDescription(): string;

  protected startBuffering(bufferIdleTime: number) {
    (async () => {
      while (this.canRead()) {
        try {
          const result = await this.readChunk();
          if (result.byteLength) {
            this.bufferedData = appendUint8Arrays([this.bufferedData, result]);
          } else {
            // console.log(this.textDecoder.decode(this.bufferedData as Uint8Array));
            await delay(bufferIdleTime);
          }
        } catch {
          // exit buffer loop if reading has failed
          break;
        }
      }
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
      while (this.canRead() && run) {
        if (this.bufferedData && this.bufferedData.byteLength >= length) {
          run = false;
        } else {
          // give the app some idle time
          await delay(idleDelay);
        }
      }
    } else if (texts instanceof Array) {
      const needles: Uint8Array[] = texts.map((text) => this.textEncoder.encode(text));
      if (needles.length === 0) { run = false; }
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
    } else {
      while (this.canRead() && run) {
        await delay(idleDelay);
      }
    }

    if (!this.bufferedData) {
      return new Uint8Array();
    }

    const result = this.bufferedData.slice(0, sliceLength);
    this.bufferedData = this.bufferedData.slice(sliceLength);
    return result;
  }

  public read(options: ReadParams): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      this.readQueue = this.readQueue
        .then(() => this.readFromBuffer(options))
        .then(resolve)
        .catch(reject);
    });
  }

  private detectActiveTypes(bytes: Uint8Array) {
    const detectString = this.textDecoder.decode(bytes);

    if (
      (detectString.indexOf(DETECT_PACKET_CAPTURE) !== -1) || // Raw Packet mode
      (detectString.indexOf(DETECT_PRINTER_EMULATOR) !== -1) // Hex encoded Tiles
    ) {
      // https://github.com/mofosyne/arduino-gameboy-printer-emulator/blob/master/GameBoyPrinterEmulator/GameBoyPrinterEmulator.ino
      this.portDeviceType = PortDeviceType.PACKET_CAPTURE;
    } else if (detectString.indexOf(DETECT_SUPER_PRINTER_INTERFACE) !== -1) {
      // https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/blob/main/Super_Printer_interface/Super_Printer_interface.ino
      this.portDeviceType = PortDeviceType.SUPER_PRINTER_INTERFACE;
      // ToDo:       this.readTimeoutDuration = 10;
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

  protected async detectType(): Promise<BaseCommsDevice | null> {
    // the printer emulator takes about 3500ms to write it's banner, so we wait a bit longer to be safe
    const bannerBytes = await this.read({
      timeout: 5000,
      texts: [
        DETECT_PACKET_CAPTURE,
        DETECT_PRINTER_EMULATOR,
        DETECT_SUPER_PRINTER_INTERFACE,
      ],
    });

    this.detectActiveTypes(bannerBytes);

    let unknownBanner: Uint8Array = new Uint8Array();

    if (this.portDeviceType !== PortDeviceType.UNKNOWN) {
      // A known device type was recognized -> clear buffer to remove "rest" of banner
      this.bufferedData = null;
    } else if (bannerBytes.byteLength) {
      // Banner was received, but device type was not not recognized
      unknownBanner = bannerBytes;
      this.portDeviceType = PortDeviceType.INACTIVE;
    } else {
      // Unknown device type and no banner. Try to detect a "passive" device
      const [readCrLf] = await this.send(new Uint8Array([0x0d, 0x0a]), [{ timeout: 500 }], true); // cr/lf
      if (readCrLf.byteLength) {
        unknownBanner = readCrLf;
        this.portDeviceType = PortDeviceType.INACTIVE;
      }
    }

    switch (this.portDeviceType) {
      case PortDeviceType.PACKET_CAPTURE: {
        await this.read({ timeout: 500 }); // flush the rest of the banner
        return new CaptureCommsDevice(this);
      }

      case PortDeviceType.SUPER_PRINTER_INTERFACE: {
        return new SuperPrinterCommsDevice(this);
      }

      case PortDeviceType.INACTIVE: {
        const moreBytes: Uint8Array = await this.read({ timeout: 500 }); // flush the rest of the banner
        return new InactiveCommsDevice(this, appendUint8Arrays([unknownBanner, moreBytes]));
      }

      case PortDeviceType.UNKNOWN:
      default: {
        throw new Error('device is not a known device');
      }
    }
  }
}
