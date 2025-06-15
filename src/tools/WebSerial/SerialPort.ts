import { PortDeviceType, PortsWorkerMessageType, WorkerCommand } from '@/consts/ports';
import { CommonPort } from '@/tools/CommonPort';
import { randomId } from '@/tools/randomId';
import { PortSettings, PortsWorkerCommand, PortsWorkerQuestionMessage } from '@/types/ports';

class CommonSerialPort extends CommonPort {
  private device: SerialPort;
  private baudRate: number;
  private reader: ReadableStreamDefaultReader | null;
  private id: string;

  constructor(device: SerialPort) {
    super();
    this.device = device;
    this.baudRate = 0;
    this.reader = null;
    this.id = randomId();
  }

  getDevice(): SerialPort {
    return this.device;
  }

  getBaudRate(): number {
    return this.baudRate;
  }

  getId(): string {
    return this.id;
  }

  protected canRead(): boolean {
    return Boolean(this.reader && this.getPortDeviceType() !== PortDeviceType.INACTIVE);
  }

  protected async readChunk(): Promise<Uint8Array> {
    const result = await this.reader?.read();
    const bytes = result?.value as Uint8Array;
    return bytes;
  }

  async queryPortSettings(): Promise<void> {
    const portSettings: PortSettings | null = await (new Promise((resolve) => {
      const questionId = randomId();

      const handler = (event: MessageEvent<PortsWorkerCommand>) => {
        if (event.data.type === WorkerCommand.ANSWER && event.data.questionId === questionId) {
          self.removeEventListener('message', handler);
          resolve(event.data.response);
        }
      };

      self.addEventListener('message', handler);

      const questionMessage: PortsWorkerQuestionMessage = {
        type: PortsWorkerMessageType.QUESTION,
        questionId,
      };

      postMessage(questionMessage);
    }));

    this.baudRate = portSettings?.baudRate || 0;
  }

  async connect() {
    try {
      await this.queryPortSettings();

      if (!this.baudRate) {
        return;
      }

      console.log(this.baudRate);

      await this.device.open({ baudRate: this.baudRate });

      this.device.addEventListener('disconnect', () => {
        this.emit('close');
      });

      this.reader = this.device.readable.getReader();

      this.readLoop();
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
