import { CommonPort } from '@/tools/comms/CommonPort';
import { CommsApiBase } from '@/types/ports';

export abstract class CommsDevice<TApi = CommsApiBase, TSetup = undefined> {
  abstract getApi: () => Promise<TApi>;
  abstract getDevice: () => CommonPort;
  abstract setup: (params: TSetup) => Promise<void>;
  abstract getInfo: () => Promise<Record<string, string>>;
}
