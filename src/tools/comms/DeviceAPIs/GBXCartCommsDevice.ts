import { GBXCartCommands, GBXCartDeviceVars, GBXCartPCBVersions } from '@/consts/gbxCart';
import { PortDeviceType, PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { randomId } from '@/tools/randomId';
import { SetProgressCallback, StartProgressCallback, StopProgressCallback } from '@/types/ports';

interface SetupParams {
  startProgress: StartProgressCallback;
  setProgress: SetProgressCallback;
  stopProgress: StopProgressCallback;
}

export class GBXCartCommsDevice implements BaseCommsDevice {
  private device: CommonPort;
  public readonly id: string;
  public readonly description: string;
  public readonly portDeviceType = PortDeviceType.GBXCART;
  public readonly portType: PortType;
  private readonly fwVer: number;
  private startProgress: StartProgressCallback = async (label: string): Promise<string> => { console.log(label); return '#'; };
  private setProgress: SetProgressCallback = (id: string, value: number) => { console.log(`${id} - ${Math.round(value * 100)}%`); };
  private stopProgress: StopProgressCallback = (id: string) => { console.log(`${id} - done`); };

  constructor(device: CommonPort, version: Uint8Array, isJoeyJr: boolean) {
    this.device = device;
    this.portType = device.portType;
    this.fwVer = version[3];
    this.id = randomId();
    this.description = [
      isJoeyJr ? '(JoeyJr)' : '',
      GBXCartPCBVersions[version[4]] || 'Unknown PCB Version',
      device.getDescription(),
    ]
      .filter(Boolean)
      .join(' - ');
  }

  private async waitForAck(timeout = 1000) : Promise<void> {
    if (this.fwVer < 12) { return; }

    const values = [0x01, 0x03];
    const [result] = await this.device.read({ length: 1, timeout });

    if (!values.includes(result)) {
      throw new Error('no ack received');
    }
  }

  private async setFwVariable(varKey: keyof typeof GBXCartDeviceVars, varValue: number) {
    const { size, value } = GBXCartDeviceVars[varKey];
    const commandValue = GBXCartCommands['SET_VARIABLE'];

    const buffer = new ArrayBuffer(13);
    const view = new DataView(buffer);

    view.setUint8(0, commandValue);
    view.setUint8(1, size);
    view.setUint32(2, value, false);
    view.setUint32(6, varValue, false);
    view.setUint8(10, 0);
    view.setUint8(11, 0);
    view.setUint8(12, 0);

    await this.device.send(new Uint8Array(buffer), [], true);
    await this.waitForAck();
  }

  private async cartWrite(address: number, value: number) {
    const buffer = new ArrayBuffer(6);
    const view = new DataView(buffer);

    /* eslint-disable no-bitwise */
    view.setUint8(0, GBXCartCommands['DMG_CART_WRITE'] & 0xFF);
    view.setUint32(1, address, false);
    view.setUint8(5, value & 0xFF);
    /* eslint-enable no-bitwise */

    await this.device.send(new Uint8Array(buffer), [], true);
    await this.waitForAck();
  }

  private async readRAM(address: number, size: number): Promise<Uint8Array> {
    if (size > 0x40) { throw new Error('read size too big'); }
    await this.setFwVariable('TRANSFER_SIZE', size);
    await this.setFwVariable('ADDRESS', 0xA000 + address);
    await this.setFwVariable('DMG_ACCESS_MODE', 3);
    await this.setFwVariable('DMG_READ_CS_PULSE', 1);

    const readCommand = new Uint8Array([GBXCartCommands['DMG_CART_READ']]);
    const [cartReadResult] = await this.device.send(readCommand, [{ length: size }], true);

    return cartReadResult;
  }

  private async readROM(address: number, size: number): Promise<Uint8Array> {
    if (size > 0x40) { throw new Error('read size too big'); }
    await this.setFwVariable('TRANSFER_SIZE', size);
    await this.setFwVariable('ADDRESS', address);
    await this.setFwVariable('DMG_ACCESS_MODE', 1);

    const readCommand = new Uint8Array([GBXCartCommands['DMG_CART_READ']]);
    const [cartReadResult] = await this.device.send(readCommand, [{ length: size }], true);

    return cartReadResult;
  }

  public async readROMName(): Promise<string> {
    await this.setModeVoltage();
    const textDecoder = new TextDecoder();
    const cartReadResult = await this.readROM(0x134, 0x10);
    const romName = textDecoder.decode(cartReadResult.filter((byte) => (byte !== 0 && byte !== 128)));
    return romName;
  }

  public async readRAMImage(): Promise<Uint8Array[]> {
    await this.setModeVoltage();
    const chunks: Uint8Array[] = [];
    const chunkSize = 0x40;
    const readSize = 0x2000;
    const ramBanks = 16;
    const totalChunks = ramBanks * readSize / chunkSize;

    const handle = await this.startProgress('Loading Camera RAM');

    for (let ramBank = 0; ramBank < ramBanks; ramBank += 1) {
      await this.cartWrite(0x4000, ramBank); // Set SRAM bank
      this.setProgress(handle, chunks.length / totalChunks);
      for (let offset = 0; offset < readSize / chunkSize; offset += 1) {
        chunks.push(await this.readRAM(chunkSize * offset, chunkSize));
        // console.log(`${chunks.length}/${totalChunks}`);
      }
    }

    this.stopProgress(handle);
    return chunks;
  }

  public async readPhotoRom(): Promise<Uint8Array[]> {
    await this.setModeVoltage();
    const chunks: Uint8Array[] = [];
    const chunkSize = 0x40;
    const readSize = 0x4000;
    const romBanks = 64;
    const totalChunks = romBanks * readSize / chunkSize;

    const handle = await this.startProgress('Loading Album Rolls from Photo!');

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

    this.stopProgress(handle);
    return chunks;
  }

  public async checkFirmware() {
    this.setModeVoltage();
    const message = new Uint8Array([GBXCartCommands['QUERY_FW_INFO']]);
    const [firmwareResult] = await this.device.send(message, [{ length: 9 }], true);

    const [
      ,
      cfwId,
      ,
      fwVer,
      pcbVer,
    ] = firmwareResult;

    const timestamp = (new DataView(firmwareResult.buffer, 5, 4)).getUint32(0, false);

    const date = new Date(timestamp * 1000);

    console.log({
      cfwId: String.fromCharCode(cfwId),
      fwVer,
      pcbVer: GBXCartPCBVersions[pcbVer] || 'Unknown PCB Version',
      timestamp,
      date: date.toISOString(),
    });
  }

  public async setModeVoltage() {
    const setModeCommand = new Uint8Array([GBXCartCommands['SET_MODE_DMG']]);
    const setVoltageCommand = new Uint8Array([GBXCartCommands['SET_VOLTAGE_5V']]);
    await this.device.send(setModeCommand, [], true);
    await this.waitForAck();
    await this.device.send(setVoltageCommand, [], true);
    await this.waitForAck();
  }

  async setup({ startProgress, setProgress, stopProgress }: SetupParams) {
    this.startProgress = startProgress;
    this.setProgress = setProgress;
    this.stopProgress = stopProgress;
  }
}
