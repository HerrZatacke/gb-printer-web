import { PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import {
  DEFAULT_BAUD_RATE,
  FAST_BAUD_RATE,
  PicNRecCommsDevice,
} from '@/tools/comms/DeviceAPIs/PicNRecCommsDevice';
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

  private async openConnection(baudRate: number): Promise<void> {
    this.baudRate = baudRate;
    await this.device.open({ baudRate });

    this.reader = this.device.readable.getReader();
    this.writer = this.device.writable.getWriter();
    this.startBuffering(50);
  }

  private async closeConnection(): Promise<void> {
    const currentReader = this.reader;
    const currentWriter = this.writer;

    this.reader = null;
    this.writer = null;

    if (currentReader) {
      try {
        await currentReader.cancel();
      } catch {
      }

      currentReader.releaseLock();
    }

    if (currentWriter) {
      currentWriter.releaseLock();
    }

    if (this.device.readable || this.device.writable) {
      await this.device.close();
    }
  }

  private async changeBaudRate(baudRate: number): Promise<void> {
    if (this.baudRate === baudRate && this.reader && this.writer) {
      return;
    }

    await this.closeConnection();
    await this.openConnection(baudRate);
  }

  private async detectPicNRecWithModeRecovery(): Promise<BaseCommsDevice | null> {
    const currentProbe = await PicNRecCommsDevice.probe(this);
    if (typeof currentProbe === 'number') {
      return new PicNRecCommsDevice(this);
    }

    if (![DEFAULT_BAUD_RATE, FAST_BAUD_RATE].includes(this.baudRate)) {
      return null;
    }

    const originalBaudRate = this.baudRate;
    const alternateBaudRate = originalBaudRate === DEFAULT_BAUD_RATE ? FAST_BAUD_RATE : DEFAULT_BAUD_RATE;

    await this.changeBaudRate(alternateBaudRate);

    const alternateProbe = await PicNRecCommsDevice.probe(this);
    if (typeof alternateProbe === 'number') {
      return new PicNRecCommsDevice(this);
    }

    await this.changeBaudRate(originalBaudRate);
    return null;
  }

  async connect(): Promise<BaseCommsDevice | null> {
    const settings = await this.settingsCallback();
    this.baudRate = settings?.baudRate || 0;
    if (!this.baudRate) { return null; }

    await this.openConnection(this.baudRate);

    const detectedPicNRec = await this.detectPicNRecWithModeRecovery();
    if (detectedPicNRec) {
      return detectedPicNRec;
    }

    return this.detectType();
  }

  protected async sendRaw(data: BufferSource) {
    if (!this.device?.writable || !this.writer) {
      throw new Error('device is not writable');
    }

    await this.writer.write(data);
  }
}

export default CommonSerialPort;
