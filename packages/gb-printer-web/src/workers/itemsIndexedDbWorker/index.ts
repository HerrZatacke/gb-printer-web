import * as Comlink from 'comlink';
import { type ItemsSource, ItemsSourceApi } from 'gb-items-source';
import { openAndPrepareDb } from '@/workers/itemsIndexedDbWorker/db';
import { RemoteItemsSource } from '@/workers/itemsIndexedDbWorker/RemoteItemsSource';
import {
  type InitWorkerFn,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const init: InitWorkerFn = async (hostApi: ItemsHostApi, remoteStorageUrl: string) => {
  let instance: ItemsSource;

  if (remoteStorageUrl) {
    instance = new RemoteItemsSource(remoteStorageUrl);
  } else {
    const db = await openAndPrepareDb(hostApi);
    instance = new ItemsSourceApi(db) as unknown as ItemsSource;
  }

  return Comlink.proxy(instance);
};

Comlink.expose(init);
