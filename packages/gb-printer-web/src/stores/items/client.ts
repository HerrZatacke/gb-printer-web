'use client';
import * as Comlink from 'comlink';
import { ItemsSource } from 'gb-items-source';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';
import {
  type InitWorkerFn,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

declare global {
  var __itemsSourcePromise: Promise<ItemsSource> | undefined;
}

export const getItemsSource = async (): Promise<ItemsSource> => {
  if (typeof window === 'undefined') {
    throw new Error('cannot create worker server-side');
  }

  if (!globalThis.__itemsSourcePromise) {
    globalThis.__itemsSourcePromise = (async () => {
      const worker = new Worker(new URL('@/workers/itemsIndexedDbWorker', import.meta.url), { type: 'module' });
      const initWorker = Comlink.wrap<InitWorkerFn>(worker);

      const hostApi: ItemsHostApi = {
        async getLegacyStorage(): Promise<Record<string, unknown[]>> {
          try {
            const legacyState = JSON.parse(localStorage.getItem('gbp-z-web-items') || 'null');
            return legacyState?.state || {};
          } catch {
            return {};
          }
        },
        onMigrationError(message: string) {
          useInteractionsStore.getState().setFatalError(Error(message));
        },
      };

      // Page needs refresh if this setting has been updated.
      const { remoteStorageUrl } = useSettingsStore.getState();

      return initWorker(Comlink.proxy(hostApi), remoteStorageUrl);
    })().catch((err) => {
      globalThis.__itemsSourcePromise = undefined;
      throw err;
    });
  }

  return globalThis.__itemsSourcePromise;
};
