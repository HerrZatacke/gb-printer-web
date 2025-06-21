import { PortDeviceType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import { randomId } from '@/tools/randomId';
import { SettingsCallbackFn } from '@/types/ports';

class CommonSerialPort extends CommonPort {
  private device: SerialPort;
  private baudRate: number;
  private reader: ReadableStreamDefaultReader | null;
  private id: string;
  private settingsCallbackFn: SettingsCallbackFn;

  constructor(device: SerialPort, settingsCallbackFn: SettingsCallbackFn) {
    super();
    this.device = device;
    this.settingsCallbackFn = settingsCallbackFn;
    this.baudRate = 0;
    this.reader = null;
    this.id = randomId();
  }

  // ToDo: still needed?
  public getDevice(): SerialPort {
    return this.device;
  }

  public getBaudRate(): number {
    return this.baudRate;
  }

  public getId(): string {
    return this.id;
  }

  public canRead(): boolean {
    return Boolean(this.reader && this.getPortDeviceType() !== PortDeviceType.INACTIVE);
  }

  protected async readChunk(): Promise<Uint8Array> {
    const result = await this.reader?.read();
    const bytes = result?.value as Uint8Array;
    return bytes;
  }

  async connect(): Promise<CaptureCommsDevice | null> {
    const settings = await this.settingsCallbackFn();
    this.baudRate = settings?.baudRate || 0;
    if (!this.baudRate) { return null; }

    await this.device.open({ baudRate: this.baudRate });

    // this.device.addEventListener('disconnect', () => {
    //   console.log('can I be here??');
    //   this.emit('close');
    // });

    this.reader = this.device.readable.getReader();

    this.startBuffering(50);
    return this.detectType();
  }

  protected async sendRaw(data: BufferSource) {
    if (!this.device?.writable) {
      throw new Error('device is not writable');
    }

    const writer = this.device.writable.getWriter();
    await writer.write(data);
  }
}

export default CommonSerialPort;
