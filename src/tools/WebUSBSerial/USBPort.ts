import { PortDeviceType } from '@/consts/ports';
import { CommonPort } from '@/tools/CommonPort';
import { randomId } from '@/tools/randomId';
import { ReadResult } from '@/types/ports';

class CommonUSBPort extends CommonPort {
  private device: USBDevice;
  private productName: string;
  private interfaceNumber: number;
  private endpointIn: number;
  private endpointOut: number;
  private id: string;
  private textDecoder: TextDecoder;

  constructor(device: USBDevice) {
    super();
    this.device = device;
    this.productName = device.productName || '';
    this.interfaceNumber = 2; // original interface number of WebUSB Arduino demo
    this.endpointIn = 5; // original in endpoint ID of WebUSB Arduino demo
    this.endpointOut = 4; // original out endpoint ID of WebUSB Arduino demo
    this.textDecoder = new TextDecoder();
    this.id = randomId();
  }

  getDevice(): USBDevice {
    return this.device;
  }

  getProductName(): string {
    return this.productName;
  }

  getId(): string {
    return this.id;
  }

  canRead(): boolean {
    return Boolean(
      this.device &&
      this.device.opened &&
      this.getPortDeviceType() !== PortDeviceType.INACTIVE);
  }

  async read(): Promise<ReadResult> {
    const result = await this.device.transferIn(this.endpointIn, 64);
    const dataView  = result?.data || new DataView(new Uint8Array([]).buffer);
    const bytes = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);

    return {
      bytes,
      string: this.textDecoder.decode(bytes),
      portDeviceType: this.getPortDeviceType(),
      deviceId: this.getId(),
    };
  }

  async connect(): Promise<void> {
    try {

      await this.device.open();
      await this.device?.selectConfiguration?.(1);

      const configurationInterfaces = this.device.configuration?.interfaces;
      if (!configurationInterfaces) {
        return;
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

      this.readLoop();
    } catch (error) {
      console.error(error);
      this.emit('errormessage', 'could not mount device');
    }
  }

  async send(data: BufferSource): Promise<void> {
    await this.device.transferOut(this.endpointOut, data);
  }
}

export default CommonUSBPort;
