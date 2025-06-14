import EventEmitter from 'events';
import { PortDeviceType } from '@/consts/ports';
import { getNewReadResult, mergeReadResults } from '@/tools/mergeReadResults';
import { ReadResult } from '@/types/ports';

declare const self: DedicatedWorkerGlobalScope;

export abstract class CommonPort extends EventEmitter {
  protected portDeviceType: PortDeviceType;
  private readTimeoutDuration: number;

  constructor() {
    super();
    this.portDeviceType = PortDeviceType.UNKNOWN;
    this.readTimeoutDuration = 1000;
  }

  getPortDeviceType(): PortDeviceType {
    return this.portDeviceType;
  }

  abstract canRead(): boolean
  abstract getId(): string
  abstract send(data: BufferSource): Promise<void>
  abstract read(): Promise<ReadResult>

  private async detectPassiveDevice(): Promise<void> {
    await this.send(new Uint8Array([0x0d, 0x0a])); // cr/lf
    await this.send(new Uint8Array([0xa1])); // Query GBXCart Version
  }

  async readLoop () {
    let readTimeout = 0;
    let readResult = getNewReadResult(this.getId(), this.portDeviceType);

    const emitData = () => {
      // Dont emit if there's no content
      if (readResult.string.length === 0 && readResult.bytes.byteLength === 0) {
        return;
      }

      this.emit('data', readResult);

      readResult = getNewReadResult(this.getId(), this.portDeviceType);
    };


    let detectionTimeout = self.setTimeout(async () => {
      this.portDeviceType = PortDeviceType.PASSIVE;
      this.emit('typechange');

      this.detectPassiveDevice();

      // Detect passive device (device only sends data after a query)
      detectionTimeout = self.setTimeout(async () => {
        readResult = getNewReadResult(this.getId(), this.portDeviceType);
        this.portDeviceType = PortDeviceType.INACTIVE;
        this.emit('typechange');
      }, 1500);

    }, 1500);

    const detectActiveType = () => {
      if (
        (readResult.string.indexOf('GAMEBOY PRINTER Packet Capture') !== -1) || // Raw Packet mode
        (readResult.string.indexOf('GAMEBOY PRINTER Emulator') !== -1) // Hex encoded Tiles
      ) {
        // https://github.com/mofosyne/arduino-gameboy-printer-emulator/blob/master/GameBoyPrinterEmulator/GameBoyPrinterEmulator.ino
        this.portDeviceType = PortDeviceType.PACKET_CAPTURE;
        self.clearTimeout(detectionTimeout);
        this.emit('typechange');
      } else if (readResult.string.indexOf('Super Printer Interface by Raphaël BOICHOT') !== -1) {
        // https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/blob/main/Super_Printer_interface/Super_Printer_interface.ino
        this.portDeviceType = PortDeviceType.SUPER_PRINTER_INTERFACE;
        this.readTimeoutDuration = 10;
        self.clearTimeout(detectionTimeout);
        this.emit('typechange');
      }
    };

    const detectPassiveType = async () => {
      console.log([...readResult.bytes]);
      this.portDeviceType = PortDeviceType.INACTIVE;
      self.clearTimeout(detectionTimeout);
      this.emit('typechange');
    };

    try {
      /* eslint-disable no-await-in-loop */
      while (this.canRead()) {
        const result = await this.read();

        this.emit('receiving');

        self.clearTimeout(readTimeout);
        readResult = mergeReadResults(readResult, result);

        if (this.portDeviceType === PortDeviceType.UNKNOWN) {
          detectActiveType();
        } else if (this.portDeviceType === PortDeviceType.PASSIVE) {
          await detectPassiveType();
        }

        readTimeout = self.setTimeout(emitData, this.readTimeoutDuration);
      }
      /* eslint-enable no-await-in-loop */
    } catch (error) {
      this.emit('error', (error as Error).message);
    }
  };
}
