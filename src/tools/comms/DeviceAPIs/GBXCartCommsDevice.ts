import { GBXCartCommands, GBXCartDeviceVars, GBXCartPCBVersions } from '@/consts/gbxCart';
import { PortDeviceType, PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { randomId } from '@/tools/randomId';

export class GBXCartCommsDevice implements BaseCommsDevice {
  private device: CommonPort;
  public readonly id: string;
  public readonly description: string;
  public readonly portDeviceType = PortDeviceType.GBXCART;
  public readonly portType: PortType;

  constructor(device: CommonPort, version: Uint8Array) {
    this.device = device;
    this.portType = device.portType;
    this.id = randomId();
    const pcbVersion = version[4];
    this.description = `GBxCart RW ${GBXCartPCBVersions[pcbVersion]} ${device.getDescription()}`;
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

    const command = new Uint8Array(buffer);

    await this.device.send(command, [], true);
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

  public async readImageSlot(): Promise<Uint8Array[]> {
    await this.setModeVoltage();
    const chunks: Uint8Array[] = [];
    const chunkSize = 0x40;
    const readSize = 0x1000;

    for (let offset = 0; offset < readSize / chunkSize; offset += 1) {
      chunks.push(await this.readRAM(chunkSize * offset, chunkSize));
      console.log(`${chunks.length}/${readSize / chunkSize} -> ${chunks.length / (readSize / chunkSize)}`);
    }

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
      fvVer,
      pcbVer,
      ...dateBytes
    ] = firmwareResult;

    // eslint-disable-next-line no-bitwise
    const timestamp = (dateBytes[0] << 24) + (dateBytes[1] << 16) + (dateBytes[2] << 8) + dateBytes[3];
    const date = new Date(timestamp * 1000);

    console.log({
      cfwId: String.fromCharCode(cfwId),
      fvVer,
      pcbVer: GBXCartPCBVersions[pcbVer],
      timestamp,
      date: date.toISOString(),
    });
  }

  public async setModeVoltage() {
    const setModeVoltageCommand = new Uint8Array([GBXCartCommands['SET_MODE_DMG'], GBXCartCommands['SET_VOLTAGE_5V']]);
    await this.device.send(setModeVoltageCommand, [], true);
  }
}
