import EventEmitter from 'events';
import { GBXCartCommands, GBXCartPCBVersions } from '@/consts/gbxCart';
import { PortType } from '@/consts/ports';
import { appendUint8Arrays } from '@/tools/appendUint8Arrays';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import { GBXCartCommsDevice } from '@/tools/comms/DeviceAPIs/GBXCartCommsDevice';
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
  // public portDeviceType: PortDeviceType;
  private textDecoder: TextDecoder;
  private textEncoder: TextEncoder;
  private bufferedData: Uint8Array | null;
  private readQueue: Promise<void>;
  protected enabled: boolean = true;

  protected constructor(portType: PortType) {
    super();
    // this.portDeviceType = PortDeviceType.UNKNOWN;
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

  disable() {
    this.enabled = false;
  }

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

    if (typeof timeout === 'number') {
      setTimeout(() => { run = false; }, timeout);
    }

    if (typeof length === 'number') {
      if (length === 0) { run = false; }
      while (run) {
        if (this.bufferedData && this.bufferedData.byteLength >= length) {
          run = false;
        } else {
          await delay(0);
        }
      }
    } else if (texts instanceof Array) {
      if (texts.length === 0) { run = false; }
      while (run) {
        if (this.bufferedData && this.bufferedData.byteLength) {
          const needleIndex = texts
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
            await delay(0);
          }
        } else {
          await delay(0);
        }
      }
    } else {
      while (run) {
        await delay(0);
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

  private async detectActiveTypes(bytes: Uint8Array): Promise<BaseCommsDevice | null> {
    if (
      (findSubarray(bytes, this.textEncoder.encode(DETECT_PACKET_CAPTURE)) !== -1) || // Raw Packet mode
      (findSubarray(bytes, this.textEncoder.encode(DETECT_PRINTER_EMULATOR)) !== -1) // Hex encoded Tiles
    ) {
      // https://github.com/mofosyne/arduino-gameboy-printer-emulator/blob/master/GameBoyPrinterEmulator/GameBoyPrinterEmulator.ino
      await this.read({ timeout: 500 }); // flush the rest of the banner
      return new CaptureCommsDevice(this);
    } else if (
      findSubarray(bytes, this.textEncoder.encode(DETECT_SUPER_PRINTER_INTERFACE)) !== -1
    ) {
      // https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/blob/main/Super_Printer_interface/Super_Printer_interface.ino
      return new SuperPrinterCommsDevice(this);
    }

    return null;
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
      timeout: 4000,
      texts: [
        this.textEncoder.encode(DETECT_PACKET_CAPTURE),
        this.textEncoder.encode(DETECT_PRINTER_EMULATOR),
        this.textEncoder.encode(DETECT_SUPER_PRINTER_INTERFACE),
      ],
    });

    // Detect all active devices which send a banner by themselves
    const detectedDevice = await this.detectActiveTypes(bannerBytes);
    if (detectedDevice) {
      return detectedDevice;
    }

    // Banner was received, but device type was not not recognized
    if (bannerBytes.byteLength) {
      const moreBytes: Uint8Array = await this.read({ timeout: 500 }); // get the rest of the banner

      // Skip creating an inactive device until all GBxCart stuff is clear
      // this.disable();
      // return new InactiveCommsDevice(this, appendUint8Arrays([bannerBytes, moreBytes]), 'Banner not recognized');
      console.log('Unknown Banner', appendUint8Arrays([bannerBytes, moreBytes]));
    }

    // Unknown device type and no banner. Try to detect passive devices

    // Set possible JoeyJr into GBxCart mode
    let isJoeyJr = false;
    const [setJoeyGBxMode] = await this.send(new Uint8Array([0x4C, 0x4B]), [{
      timeout: 250,
    }], true); // gbxcart version query
    if (setJoeyGBxMode.length && setJoeyGBxMode[0] === 0xff) {
      console.log('Joey says', [...setJoeyGBxMode]);
      isJoeyJr = true;
    }

    // Query GBxCart RW version
    const [readGBXVersion] = await this.send(new Uint8Array([GBXCartCommands['QUERY_FW_INFO']]), [{ timeout: 250 }], true); // gbxcart version query
    if (readGBXVersion.length) {

      console.log('readGBXVersion', [...readGBXVersion]);

      const [
        ,
        cfwId,
        ,
        fwVer,
        pcbVer,
      ] = readGBXVersion;

      if (
        (cfwId === 76) && // "L"
        [1, 14].includes(fwVer) &&
        [4, 5, 6, 101].includes(pcbVer) // PCB Version
      ) {
        return new GBXCartCommsDevice(this, readGBXVersion, isJoeyJr);
        // return new GBXCartCommsDevice(this, readGBXVersion, false);
      }

      const moreBytes: Uint8Array = await this.read({ timeout: 500 }); // get possible rest of the banner
      this.disable();
      return new InactiveCommsDevice(this, appendUint8Arrays([readGBXVersion, moreBytes]), `GBXCart RW "${String.fromCharCode(cfwId)}${fwVer} ${GBXCartPCBVersions[pcbVer]  || 'Unknown PCB Version'}" not recognized`);
    }

    // send cr/lf to see if anything else responds and return an inactive device
    const [readCrLf] = await this.send(new Uint8Array([0x0d, 0x0a]), [{ timeout: 250 }], true);
    this.disable();
    return new InactiveCommsDevice(this, readCrLf, 'CrLf response not recognized');
  }
}

