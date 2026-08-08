import { PortDeviceType, PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { randomId } from '@/tools/randomId';

export class InactiveCommsDevice implements BaseCommsDevice {
  public readonly id: string;
  public readonly description: string;
  public readonly portDeviceType = PortDeviceType.INACTIVE;
  public readonly portType: PortType;
  private bannerBytes: Uint8Array;

  constructor(device: CommonPort, bannerBytes: Uint8Array, reason?: string) {
    this.bannerBytes = bannerBytes;
    this.portType = device.portType;
    this.description = [
      device.getDescription(),
      reason,
    ]
      .filter(Boolean)
      .join(' ');
    this.id = randomId();
  }

  async getBanner(): Promise<Uint8Array> {
    return this.bannerBytes;
  }
}
