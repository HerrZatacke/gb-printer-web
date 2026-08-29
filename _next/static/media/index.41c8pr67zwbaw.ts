import * as Comlink from 'comlink';
import { type ItemsSource, ItemsSourceApi } from 'gb-items-source';
import { openAndPrepareDb } from '@/workers/itemsIndexedDbWorker/db';
import { RemoteItemsSource } from '@/workers/itemsIndexedDbWorker/RemoteItemsSource';
import { isMutationResult } from '@/workers/itemsIndexedDbWorker/tools/isMutationResult';
import {
  type InitWorkerFn,
  type ItemsHostApi,
  type RunInvalidationsFn,
} from '@/workers/itemsIndexedDbWorker/types';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const withInvalidations = (source: ItemsSource, runInvalidations: RunInvalidationsFn, withDebug?: boolean): ItemsSource => {
  return new Proxy(source, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value !== 'function') {
        return value;
      }

      return async (...args: unknown[]) => {
        if (withDebug) {
          console.log(`[${self.constructor.name}] ${String(prop)}`, args);
        }

        const result = await value.apply(target, args);

        if (withDebug) {
          console.log(`[${self.constructor.name}] ${String(prop)} ->`, result);
        }

        if (isMutationResult(result)) {
          void runInvalidations(result.invalidations);
        }

        return result;
      };
    },
  });
};

const init: InitWorkerFn = async (hostApi: ItemsHostApi, runInvalidations: RunInvalidationsFn, remoteStorageUrl: string, withDebug?: boolean) => {
  let instance: ItemsSource;

  if (remoteStorageUrl) {
    const remoteItemsInstance = new RemoteItemsSource(remoteStorageUrl);
    remoteItemsInstance.subscribeToInvalidations(runInvalidations);
    instance = remoteItemsInstance as unknown as ItemsSource;
  } else {
    const db = await openAndPrepareDb(hostApi);
    instance = new ItemsSourceApi(db) as unknown as ItemsSource;
  }

  return Comlink.proxy(withInvalidations(instance, runInvalidations, withDebug));
};

Comlink.expose(init);
