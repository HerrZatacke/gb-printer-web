import { PortDeviceType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { CommsDevice } from '@/tools/comms/DeviceAPIs/CommsDevice';
import { appendUint8Arrays } from '@/tools/mergeReadResults';
import { randomId } from '@/tools/randomId';
import { CaptureDeviceCommsApi, CaptureSetupParams, DataCallbackFn, ReceivingCallbackFn } from '@/types/ports';

export class CaptureCommsDevice implements CommsDevice<CaptureDeviceCommsApi, CaptureSetupParams> {
  private device: CommonPort;
  private textDecoder: TextDecoder = new TextDecoder();
  private receiving: ReceivingCallbackFn = () => { /**/ };
  private data: DataCallbackFn = () => { /**/ };
  private longBuffer: Uint8Array | null = null;
  private id: string;

  constructor(device: CommonPort) {
    this.device = device;
    this.id = randomId();
    this.readLoop();
  }

  getDevice(): CommonPort {
    return this.device;
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

  async getApi(): Promise<CaptureDeviceCommsApi> {
    return {
      portDeviceType: PortDeviceType.PACKET_CAPTURE,
    };
  }

  async setup({ receiving, data }: CaptureSetupParams) {
    console.log('I got callbacks, yay!');
    this.receiving = receiving;
    this.data = data;
  }

  getInfo(): Promise<{
    id: string,
    type: string,
  }> {
    return Promise.resolve({
      id: this.id,
      type: this.constructor.name,
    });
  }
}
