import {
  GBXCartCommands,
  GBXCartDeviceVars,
  GBXCartGBFlashPCBVersions,
  GBXCartJoeyPCBVersions,
  GBXCartPCBVersions,
} from '@/consts/gbxCart';
import { PortDeviceType, PortType } from '@/consts/ports';
import { appendUint8Arrays } from '@/tools/appendUint8Arrays';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { delay } from '@/tools/delay';
import { randomId } from '@/tools/randomId';
import { SetProgressCallback, StartProgressCallback, StopProgressCallback } from '@/types/ports';

interface SetupParams {
  startProgress: StartProgressCallback;
  setProgress: SetProgressCallback;
  stopProgress: StopProgressCallback;
}

export interface GBxFwData {
  deviceName: string;
  powerControlSupport: boolean;
  bootloaderResetSupport: boolean;
  firmwareVersion: number;
  pcbVersion: number;
  pcbLabel: string;
  firmwareTimestamp: number;
  firmwareDate: Date;
}

export class GBXCartCommsDevice implements BaseCommsDevice {
  private device: CommonPort;
  public readonly id: string;
  public readonly description: string;
  public readonly portDeviceType = PortDeviceType.GBXCART;
  public readonly portType: PortType;
  private readonly fwVer: number;
  private powerControlSupport: boolean;
  private startProgress: StartProgressCallback = async (label: string): Promise<string> => { console.log(label); return '#'; };
  private setProgress: SetProgressCallback = (id: string, value: number) => { console.log(`${id} - ${Math.round(value * 100)}%`); };
  private stopProgress: StopProgressCallback = (id: string) => { console.log(`${id} - done`); };

  constructor(device: CommonPort, version: Uint8Array) {
    this.device = device;
    this.portType = device.portType;
    const firmwareInfo = GBXCartCommsDevice.parseFwResponse(version);
    this.fwVer = firmwareInfo?.firmwareVersion || 0;
    this.powerControlSupport = firmwareInfo?.powerControlSupport || false;

    /*  ToDo handle this everywhere
    DMG_READ_CS_PULSE, DMG_ACCESS_MODE and TRANSFER_SIZE only needs to be set once (before your first RAM transfer).
    ADDRESS only needs to be set once per RAM bank switch, should just auto increment.
    So just spam the readCommand to get the next data.
    * */

    this.id = randomId();
    this.description = [
      firmwareInfo?.deviceName,
      firmwareInfo?.pcbLabel,
      `fw:L${firmwareInfo?.pcbLabel}`,
      device.getDescription(),
    ]
      .filter(Boolean)
      .join(' - ');
  }

  private async waitForAck(timeout = 100) : Promise<void> {
    if (this.fwVer < 12) {
      if (this.fwVer > 1) {
        await delay(timeout);
      }
      return;
    }

    const values = [0x01, 0x03];
    const [result] = await this.device.read({ length: 1, timeout });

    if (!values.includes(result)) {
      throw new Error('no ack received');
    }
  }

  private async setFwVariable(varKey: keyof typeof GBXCartDeviceVars, varValue: number) {
    const { size, value } = GBXCartDeviceVars[varKey];
    const commandValue = GBXCartCommands['SET_VARIABLE'];

    const buffer = new ArrayBuffer(10);
    const view = new DataView(buffer);

    view.setUint8(0, commandValue);
    view.setUint8(1, size);
    view.setUint32(2, value, false);
    view.setUint32(6, varValue, false);

    await this.device.send(new Uint8Array(buffer), []);
    await this.waitForAck();
  }

  private async cartWrite(address: number, value: number) {
    const buffer = new ArrayBuffer(6);
    const view = new DataView(buffer);

    view.setUint8(0, GBXCartCommands['DMG_CART_WRITE']);
    view.setUint32(1, address, false);
    view.setUint8(5, value);

    await this.device.send(new Uint8Array(buffer), []);
    await this.waitForAck();
  }

  private async readRAM(address: number, size: number): Promise<Uint8Array> {
    const chunkSize = Math.min(0x1000, size);
    const readCommand = new Uint8Array([GBXCartCommands['DMG_CART_READ']]);
    await this.setFwVariable('TRANSFER_SIZE', chunkSize);
    await this.setFwVariable('ADDRESS', 0xA000 + address);
    await this.setFwVariable('DMG_ACCESS_MODE', 3);
    await this.setFwVariable('DMG_READ_CS_PULSE', 1);

    let result: Uint8Array = new Uint8Array([]);

    while (result.byteLength < size) {
      const [cartReadResult] = await this.device.send(readCommand, [{ length: chunkSize }]);
      result = appendUint8Arrays([result, cartReadResult]);
    }

    return result;
  }

  private async readROM(address: number, size: number): Promise<Uint8Array> {
    const chunkSize = Math.min(0x1000, size);
    const readCommand = new Uint8Array([GBXCartCommands['DMG_CART_READ']]);
    await this.setFwVariable('TRANSFER_SIZE', chunkSize);
    await this.setFwVariable('ADDRESS', address);
    await this.setFwVariable('DMG_ACCESS_MODE', 1);

    let result: Uint8Array = new Uint8Array([]);

    while (result.byteLength < size) {
      const [cartReadResult] = await this.device.send(readCommand, [{ length: chunkSize }]);
      result = appendUint8Arrays([result, cartReadResult]);
    }

    return result;
  }

  public async readROMName(): Promise<string> {
    await this.setModeVoltage();
    const textDecoder = new TextDecoder();
    const cartReadResult = await this.readROM(0x134, 0x10);
    await this.powerOff();
    const romName = textDecoder.decode(cartReadResult.filter((byte) => (byte !== 0 && byte !== 128)));
    return romName;
  }

  public async readRAMImage(): Promise<Uint8Array[]> {
    await this.setModeVoltage();
    const chunks: Uint8Array[] = [];
    const readSize = 0x2000;
    const ramBanks = 16;
    const totalChunks = ramBanks;

    const handle = await this.startProgress('Loading Camera RAM');

    const start = performance.now();

    for (let ramBank = 0; ramBank < ramBanks; ramBank += 1) {
      await this.cartWrite(0x4000, ramBank); // Set SRAM bank
      this.setProgress(handle, chunks.length / totalChunks);
      chunks.push(await this.readRAM(0, readSize));
    }

    await this.powerOff();

    console.log(`Reading RAM completed in ${((performance.now() - start) / 1000).toFixed(2)}s`);

    this.stopProgress(handle);
    return chunks;
  }

  public async readPhotoRom(): Promise<Uint8Array[]> {
    await this.setModeVoltage();
    const chunks: Uint8Array[] = [];
    const chunkSize = 0x1000;
    const readSize = 0x4000;
    const romBanks = 64;
    const totalChunks = romBanks * readSize / chunkSize;

    const handle = await this.startProgress('Loading Album Rolls from Photo!');

    const start = performance.now();

    for (let romBank = 0; romBank < romBanks; romBank += 1) {
      await this.cartWrite(0x2100, romBank); // Set ROM bank
      this.setProgress(handle, chunks.length / totalChunks);
      for (let offset = 0; offset < readSize / chunkSize; offset += 1) {
        // if first ROM bank, read 0-0x3fff, other banks from 0x4000 0x7fff
        if (romBank === 0) {
          chunks.push(await this.readROM(offset * chunkSize, chunkSize));
        } else {
          chunks.push(await this.readROM((offset * chunkSize) + 0x4000, chunkSize));
        }

      }
    }

    await this.powerOff();

    console.log(`Reading Photo ROM completed in ${((performance.now() - start) / 1000).toFixed(2)}s`);

    this.stopProgress(handle);
    return chunks;
  }

  public async checkFirmware() {
    const message = new Uint8Array([GBXCartCommands['QUERY_FW_INFO']]);
    const [firmwareResult] = await this.device.send(message, [{ timeout: 100 }]);
    console.log(GBXCartCommsDevice.parseFwResponse(firmwareResult));
  }

  public async setModeVoltage() {
    const setModeCommand = new Uint8Array([GBXCartCommands['SET_MODE_DMG']]);
    await this.device.send(setModeCommand, []);
    await this.waitForAck();

    const setVoltageCommand = new Uint8Array([GBXCartCommands['SET_VOLTAGE_5V']]);
    await this.device.send(setVoltageCommand, []);
    await this.waitForAck();

    if (this.powerControlSupport) {
      const setPwrOnCommand = new Uint8Array([
         GBXCartCommands[(this.fwVer >= 12) ? 'CART_PWR_ON' : 'OFW_CART_PWR_ON'],
      ]);
      await this.device.send(setPwrOnCommand, []);
      await this.waitForAck(250);
    }

    if (this.fwVer >= 12) {
      await this.setFwVariable('DMG_READ_METHOD', 1);
    }
  }

  public async powerOff() {
    if (this.powerControlSupport) {
      const setPwrOffCommand = new Uint8Array([
        GBXCartCommands[(this.fwVer >= 12) ? 'CART_PWR_OFF' : 'OFW_CART_PWR_OFF'],
      ]);
      await this.device.send(setPwrOffCommand, []);
      await this.waitForAck(250);
    }
  }

  async setup({ startProgress, setProgress, stopProgress }: SetupParams) {
    this.startProgress = startProgress;
    this.setProgress = setProgress;
    this.stopProgress = stopProgress;
  }

  static parseFwResponse(firmwareByteResponse: Uint8Array): GBxFwData | null {
    const textDecoder = new TextDecoder();
    if (firmwareByteResponse[1] !== 76) { return null; } // must be "L"

    const firmwareVersion = (new DataView(firmwareByteResponse.buffer, 2, 2)).getUint16(0, false);
    const pcbVersion = firmwareByteResponse[4];
    const firmwareTimestamp = (new DataView(firmwareByteResponse.buffer, 5, 4)).getUint32(0, false);
    const deviceNameLength = firmwareByteResponse[9];
    const firmwareDate = new Date(firmwareTimestamp * 1000);

    let deviceName = 'GBxCart RW';
    let powerControlSupport = firmwareVersion > 1;
    let bootloaderResetSupport = false;

    if (firmwareVersion >= 12) {
      const deviceNameBytes = new Uint8Array(firmwareByteResponse.buffer, 10, deviceNameLength - 1);
      deviceName = textDecoder.decode(deviceNameBytes);
      powerControlSupport = Boolean(firmwareByteResponse[deviceNameLength + 10]);
      bootloaderResetSupport = Boolean(firmwareByteResponse[deviceNameLength + 11]);
    }

    let pcbVersions: Record<number, string> = GBXCartPCBVersions;
    if (deviceName === 'GBFlash') {
      pcbVersions = GBXCartGBFlashPCBVersions;
    } else if (deviceName === 'Joey Jr') {
      pcbVersions = GBXCartJoeyPCBVersions;
    }

    return {
      deviceName,
      powerControlSupport,
      bootloaderResetSupport,
      firmwareVersion,
      pcbVersion,
      pcbLabel: pcbVersions[pcbVersion] || '',
      firmwareTimestamp,
      firmwareDate,
    };
  }
}
