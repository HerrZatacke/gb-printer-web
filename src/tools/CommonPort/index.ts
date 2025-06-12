import EventEmitter from 'events';
import { PortDeviceType } from '@/consts/ports';
import { ReadResult } from '@/types/ports';

declare const self: DedicatedWorkerGlobalScope;

const appendUint8Arrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
};

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

  async readLoop () {
    let readTimeout = 0;
    let stringData = '';
    let byteData: Uint8Array = new Uint8Array([]);

    const emitData = () => {
      // Dont emit if there's no content
      if (stringData.length === 0 && byteData.byteLength === 0) {
        return;
      }

      const readResult: ReadResult = {
        string: stringData,
        bytes: byteData,
        deviceId: this.getId(),
        portDeviceType: this.portDeviceType,
      };

      stringData = '';
      byteData = new Uint8Array([]);

      this.emit('data', readResult);
    };

    const detectionTimeout = self.setTimeout(() => {
      emitData(); // Emit in case something is left in the buffers
      this.portDeviceType = PortDeviceType.INACTIVE;
      this.emit('typechange');
    }, 5000);

    const detectType = (received: string) => {
      if (
        (received.indexOf('GAMEBOY PRINTER Packet Capture') !== -1) || // Raw Packet mode
        (received.indexOf('GAMEBOY PRINTER Emulator') !== -1) // Hex encoded Tiles
      ) {
        // https://github.com/mofosyne/arduino-gameboy-printer-emulator/blob/master/GameBoyPrinterEmulator/GameBoyPrinterEmulator.ino
        this.portDeviceType = PortDeviceType.PACKET_CAPTURE;
        self.clearTimeout(detectionTimeout);
        this.emit('typechange');
      } else if (received.indexOf('Super Printer Interface by Raphaël BOICHOT') !== -1) {
        // https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/blob/main/Super_Printer_interface/Super_Printer_interface.ino
        this.portDeviceType = PortDeviceType.SUPER_PRINTER_INTERFACE;
        this.readTimeoutDuration = 10;
        self.clearTimeout(detectionTimeout);
        this.emit('typechange');
      }
    };

    try {
      while (this.canRead()) {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.read();

        this.emit('receiving');

        self.clearTimeout(readTimeout);
        stringData += result.string;
        byteData = appendUint8Arrays(byteData, result.bytes);

        if (this.portDeviceType === PortDeviceType.UNKNOWN) {
          detectType(stringData);
        }

        readTimeout = self.setTimeout(emitData, this.readTimeoutDuration);

        // ToDo: handle length of data not being too long. (detect linefeeds?)
      }
    } catch (error) {
      this.emit('error', (error as Error).message);
    }
  };
}
