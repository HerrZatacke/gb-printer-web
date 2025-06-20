import { PortDeviceType } from '@/consts/ports';

export interface CommsApiBase  {
  portDeviceType: PortDeviceType;
}

export abstract class CommsDevice<T = CommsApiBase> {
  abstract getApi: () => T;
}
