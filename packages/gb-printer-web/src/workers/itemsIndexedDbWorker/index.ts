import * as Comlink from 'comlink';
import { type ItemsSource, ItemsSourceApi } from 'gb-items-source';
import { ItemsMutationReponse } from 'gb-printer-schemas';
import { openAndPrepareDb } from '@/workers/itemsIndexedDbWorker/db';
import {
  type InitWorkerFn,
  type ItemsHostApi, RunInvalidationsFn,
} from '@/workers/itemsIndexedDbWorker/types';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const isMutationResult = (result: unknown): result is ItemsMutationReponse => {
  return typeof result === 'object' && result !== null && Array.isArray((result as { invalidations: unknown }).invalidations);
};

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

const init: InitWorkerFn = async (hostApi: ItemsHostApi, runInvalidations: RunInvalidationsFn, withDebug?: boolean) => {
  const db = await openAndPrepareDb(hostApi);
  const instance = new ItemsSourceApi(db) as unknown as ItemsSource;
  return Comlink.proxy(withInvalidations(instance, runInvalidations, withDebug));
};

Comlink.expose(init);
