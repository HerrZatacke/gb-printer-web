import { CaptureCommsDevice } from '@/tools/comms/DeviceAPIs/CaptureCommsDevice';
import { PortsChangeCallbackFn } from '@/types/ports';

export class ApiProxy {
  private apis = new Map<string, CaptureCommsDevice>();
  private callback: PortsChangeCallbackFn = (exposed: CaptureCommsDevice[]) => { console.log(exposed); };

  constructor() {
    this.addApi = this.addApi.bind(this);
    this.removePort = this.removePort.bind(this);
  }

  private async sendPortsReport() {
    this.callback([...this.apis.values()]);
  }

  public async callDevice(
    deviceId: string,
    functionName: string,
    ...rest: unknown[]
  ) {
    const device = this.apis.get(deviceId);
    if (!device) { return; }

    if (typeof device[functionName as keyof CaptureCommsDevice] === 'function') {
      const fn = device[functionName as keyof CaptureCommsDevice] as (...args: unknown[]) => unknown;
      fn(...rest);
    }
  }

  public setCallback(cb: PortsChangeCallbackFn) {
    this.callback = cb;
  };

  public async addApi (newDevice: CaptureCommsDevice) {
    const device = await newDevice.getInfo();
    this.apis.set(device.id, newDevice);
    this.sendPortsReport();
  };

  public async removePort (badPort: SerialPort) {
    const badDevice = this.apis.entries()
      .find(([, apiDevice]) => (apiDevice.getDevice().getDevice() !== badPort));

    if (!badDevice) { return; }

    const [badId] = badDevice;
    this.apis.delete(badId);
    this.sendPortsReport();
  };
}
