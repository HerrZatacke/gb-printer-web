import chunk from 'chunk';
import objectHash from 'object-hash';
import { PortDeviceType, PortType } from '@/consts/ports';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { randomId } from '@/tools/randomId';
import { ReadParams, SetErrorCallback, SetProgressCallback, StartProgressCallback, StopProgressCallback } from '@/types/ports';
import { CommonPort } from '../CommonPort';

enum PrinterExposure {
  LIGHT = 0x00,
  NORMAL = 0x40,
  DARK = 0x7f,
}

interface SetupParams {
  startProgress: StartProgressCallback;
  setProgress: SetProgressCallback;
  stopProgress: StopProgressCallback;
  setError: SetErrorCallback,
}

export class SuperPrinterCommsDevice implements BaseCommsDevice {
  private device: CommonPort;
  public readonly portDeviceType = PortDeviceType.SUPER_PRINTER_INTERFACE;
  private textDecoder: TextDecoder = new TextDecoder();
  private textEncoder: TextEncoder = new TextEncoder();
  private startProgress: StartProgressCallback = async (label: string): Promise<string> => { console.log(label); return '#'; };
  private setProgress: SetProgressCallback = (id: string, value: number) => { console.log(`${id} - ${Math.round(value * 100)}%`); };
  private stopProgress: StopProgressCallback = (id: string) => { console.log(`${id} - done`); };
  private setError: SetErrorCallback = (error: string) => { console.log(error); };
  public portType: PortType;
  public id: string;
  public description: string;

  constructor(device: CommonPort) {
    this.device = device;
    this.portType = device.portType;
    this.description = device.getDescription();
    this.id = randomId();
  }

  private generatePrintCommand(
    brightness: PrinterExposure,
    topMargin: number,
    bottomMargin: number,
  ): number[] {
    // margin calculation see: https://gbdev.io/pandocs/Gameboy_Printer.html
    const margins =
      // eslint-disable-next-line no-bitwise
      (Math.max(0, Math.min(15, topMargin)) << 4) +
      (Math.max(0, Math.min(15, bottomMargin)));

    return [
      0x50, // "P" for "Print"
      margins, // default margins (=0x13 for default / top=1 bottom=3)
      0xe4, // default palette
      brightness,
      0x0d, // new line
    ];
  };

  private async sendCommands(commands: Uint8Array[]) {
    if (!commands.length) {
      return;
    }

    const totalCommands = commands.length;

    const progressHandle = await this.startProgress('Printing to Super Printer Interface');

    const sendCommand = async (): Promise<boolean> => {
      const command = commands.shift();
      if (command?.byteLength) {
        this.setProgress(progressHandle, (totalCommands - commands.length) / totalCommands);
        const queries: ReadParams[] = [
          {
            // read command echo
            length: command.byteLength,
          },
          {
            texts: [
              this.textEncoder.encode('Printer ready'),
              this.textEncoder.encode('Packet error'),
            ],
            // wait for ready or error, 20s is safe above maximum print duration.
            timeout: 20000,
          },
        ];

        const [echo, responseBytes] = await this.device.send(command, queries);

        // echo should match the command exactly
        if (objectHash(command) !== objectHash(echo)) {
          throw new Error('Command validation failed');
        }

        const responseText = this.textDecoder.decode(responseBytes);

        // response may contain 'Printer ready' or 'Packet error'
        if (responseText.indexOf('Printer ready') === -1) {
          throw new Error('Packet error');
        }

        return await sendCommand();
      }

      return true;
    };

    try {
      await sendCommand();
    } catch (error) {
      this.setError((error as Error).message);
      this.stopProgress(progressHandle);
    }
    this.stopProgress(progressHandle);
  }

  async printImage(tiles: string[]) {
    const bytes = tiles.reduce((acc: number[], tile: string): number[] => {
      const hexBytes = chunk<string>(tile, 2).flat();
      return [
        ...acc,
        ...hexBytes.map((hexByte) => parseInt(hexByte, 16)),
      ];
    }, []);

    // raw data lines without additional commands
    const lines = chunk(bytes, 640)
      .map((command) => new Uint8Array([
        0x44, // "D" for "Data"
        ...command,
        0x0d, // new line
      ]));

    // add print command every 9 lines (regular image size and maximum printer capacity)
    const commands = chunk(lines, 9)
      .map(((section: Uint8Array[], index: number, arr: Uint8Array[][]) => {
        const topMargin: number = (index === 0) ? 1 : 0;
        const bottomMargin: number = (index === arr.length - 1) ? 3 : 0;
        return [
          ...section,
          new Uint8Array(this.generatePrintCommand(PrinterExposure.DARK, topMargin, bottomMargin)),
        ];
      }))
      .flat();

    await this.sendCommands(commands);
  }

  async setup({ startProgress, setProgress, stopProgress, setError }: SetupParams) {
    this.startProgress = startProgress;
    this.setProgress = setProgress;
    this.stopProgress = stopProgress;
    this.setError = setError;
  }
}
