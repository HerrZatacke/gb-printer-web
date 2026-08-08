import { PortDeviceType, PortType } from '@/consts/ports';

export abstract class BaseCommsDevice {
  public abstract readonly portType: PortType;
  public abstract readonly portDeviceType: PortDeviceType;
  public abstract readonly id: string;
  public abstract readonly description: string;
}
