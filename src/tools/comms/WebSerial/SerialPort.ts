import { PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { SettingsCallback } from '@/types/ports';

class CommonSerialPort extends CommonPort {
  private device: SerialPort;
  private baudRate: number;
  private reader: ReadableStreamDefaultReader | null;
  private writer: WritableStreamDefaultWriter | null;
  private settingsCallback: SettingsCallback;

  constructor(device: SerialPort, settingsCallback: SettingsCallback) {
    super(PortType.SERIAL);
    this.device = device;
    this.settingsCallback = settingsCallback;
    this.baudRate = 0;
    this.reader = null;
    this.writer = null;
  }

  public getBaudRate(): number {
    return this.baudRate;
  }

  public canRead(): boolean {
    return Boolean(this.reader && this.enabled);
  }

  getDescription(): string {
    return this.baudRate ? `${this.baudRate} baud` : '';
  }

  protected async readChunk(): Promise<Uint8Array> {
    const result = await this.reader?.read();
    const bytes = result?.value as Uint8Array;
    return bytes;
  }

  async connect(): Promise<BaseCommsDevice | null> {
    const settings = await this.settingsCallback();
    this.baudRate = settings?.baudRate || 0;
    if (!this.baudRate) { return null; }

    await this.device.open({ baudRate: this.baudRate });

    this.reader = this.device.readable.getReader();
    this.writer = this.device.writable.getWriter();

    this.startBuffering(50);
    return this.detectType();
  }

  protected async sendRaw(data: BufferSource) {
    if (!this.device?.writable || !this.writer) {
      throw new Error('device is not writable');
    }

    this.writer.write(data);
  }
}

export default CommonSerialPort;
