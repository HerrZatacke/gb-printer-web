import { PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';

class CommonUSBPort extends CommonPort {
  private device: USBDevice;
  private productName: string;
  private interfaceNumber: number;
  private endpointIn: number;
  private endpointOut: number;

  constructor(device: USBDevice) {
    super(PortType.USB);
    this.device = device;
    this.productName = device.productName || '';
    this.interfaceNumber = 2; // original interface number of WebUSB Arduino demo
    this.endpointIn = 5; // original in endpoint ID of WebUSB Arduino demo
    this.endpointOut = 4; // original out endpoint ID of WebUSB Arduino demo
  }

  canRead(): boolean {
    return Boolean(
      this.device &&
      this.device.opened &&
      this.enabled);
  }

  getDescription(): string {
    return this.productName;
  }

  protected async readChunk(): Promise<Uint8Array> {
    const result = await this.device.transferIn(this.endpointIn, 64);
    const dataView  = result?.data || new DataView(new Uint8Array([]).buffer);
    const bytes = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);

    return bytes;
  }

  async connect(): Promise<BaseCommsDevice | null> {
    await this.device.open();

    await this.device.selectConfiguration(1);

    const configurationInterfaces = this.device.configuration?.interfaces;
    if (!configurationInterfaces) {
      return null;
    }

    configurationInterfaces.forEach((element) => {
      element.alternates.forEach((elementalt) => {
        if (elementalt.interfaceClass === 0xff) {
          this.interfaceNumber = element.interfaceNumber;
          elementalt.endpoints.forEach((elementendpoint) => {
            if (elementendpoint.direction === 'out') {
              this.endpointOut = elementendpoint.endpointNumber;
            }

            if (elementendpoint.direction === 'in') {
              this.endpointIn = elementendpoint.endpointNumber;
            }
          });
        }
      });
    });

    await this.device.claimInterface(this.interfaceNumber);

    await this.device.selectAlternateInterface(this.interfaceNumber, 0);

    // The vendor-specific interface provided by a device using this
    // Arduino library is a copy of the normal Arduino USB CDC-ACM
    // interface implementation and so reuses some requests defined by
    // that specification. This request sets the DTR (data terminal
    // ready) signal high to indicate to the device that the host is
    // ready to send and receive data.
    await this.device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: this.interfaceNumber,
    });

    this.startBuffering(50);
    return this.detectType();
  }

  protected async sendRaw(data: BufferSource): Promise<void> {
    await Promise.race([
      this.device.transferOut(this.endpointOut, data),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Device did not accept data after 10s')), 10000),
      ),
    ]);
  }
}

export default CommonUSBPort;
