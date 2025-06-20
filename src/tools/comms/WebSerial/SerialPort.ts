import { PortDeviceType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
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
  getDevice(): SerialPort {
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

  async connect() {
    try {
      const settings = await this.settingsCallbackFn();
      this.baudRate = settings?.baudRate || 0;
      if (!this.baudRate) { return; }

      await this.device.open({ baudRate: this.baudRate });

      this.device.addEventListener('disconnect', () => {
        this.emit('close');
      });

      this.reader = this.device.readable.getReader();

      this.startBuffering(50);
      this.detectType();
    } catch (error) {
      console.error(error);
      this.emit('errormessage', 'could not mount device');
    }
  }

  protected async sendRaw(data: BufferSource) {
    if (!this.device?.writable) {
      this.emit('errormessage', 'device is not writable');
    }

    const writer = this.device.writable.getWriter();

    try {
      await writer.write(data);
    } catch {
      console.error('Failed to write to serial port');
    } finally {
      writer.releaseLock();
    }
  }
}

export default CommonSerialPort;
