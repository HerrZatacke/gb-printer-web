import { PortDeviceType, PortType } from '@/consts/ports';
import { appendUint8Arrays } from '@/tools/appendUint8Arrays';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { randomId } from '@/tools/randomId';

type ReceivingCallback = () => void;
type DataCallback = (data: string) => void;

interface SetupParams {
  receiving: ReceivingCallback,
  data: DataCallback,
}

export class CaptureCommsDevice implements BaseCommsDevice {
  private device: CommonPort;
  private textDecoder: TextDecoder = new TextDecoder();
  private receiving: ReceivingCallback = () => { /**/ };
  private data: DataCallback = () => { /**/ };
  private longBuffer: Uint8Array | null = null;
  public readonly id: string;
  public readonly description: string;
  public readonly portDeviceType = PortDeviceType.PACKET_CAPTURE;
  public readonly portType: PortType;

  constructor(device: CommonPort) {
    this.device = device;
    this.portType = device.portType;
    this.description = device.getDescription();
    this.id = randomId();
    this.readLoop();
  }

  private async readLoop() {
    let finalTimeout = 0;

    const finalHandler = () => {
      if (!this.longBuffer?.byteLength) { return; }
      this.data(this.textDecoder.decode(this.longBuffer));
      this.longBuffer = null;
    };

    const device = this.device;
    while (device.canRead()) {
      const result: Uint8Array = await device.read({ timeout: 100 });

      if (result.byteLength) {
        self.clearTimeout(finalTimeout);
        finalTimeout = self.setTimeout(finalHandler, 1000);
        this.receiving();
        this.longBuffer = appendUint8Arrays([this.longBuffer, result]);
      }
    }
  }

  async setup({ receiving, data }: SetupParams) {
    this.receiving = receiving;
    this.data = data;
  }
}
