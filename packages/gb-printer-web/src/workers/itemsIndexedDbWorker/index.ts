import * as Comlink from 'comlink';
import { type ItemsSource, ItemsSourceApi } from 'gb-items-source';
import { openAndPrepareDb } from '@/workers/itemsIndexedDbWorker/db';
import {
  type InitWorkerFn,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const withDebugLogging = (source: ItemsSource): ItemsSource => {
  return new Proxy(source, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value !== 'function') {
        return value;
      }

      return async (...args: unknown[]) => {
        console.log(`[${self.constructor.name}] ${String(prop)}`, args);
        const result = await value.apply(target, args);
        console.log(`[${self.constructor.name}] ${String(prop)} ->`, result);
        return result;
      };
    },
  });
};

const init: InitWorkerFn = async (hostApi: ItemsHostApi, withDebug?: boolean) => {
  const db = await openAndPrepareDb(hostApi);
  const instance = new ItemsSourceApi(db) as unknown as ItemsSource;

  if (withDebug) {
    return Comlink.proxy(withDebugLogging(instance));
  }

  return Comlink.proxy(instance);
};

Comlink.expose(init);
