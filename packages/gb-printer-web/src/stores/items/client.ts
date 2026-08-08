'use client';
import * as Comlink from 'comlink';
import { useInteractionsStore } from '@/stores/stores';
import { type ItemsHostApi, type ItemsSource } from '@/workers/itemsIndexedDbWorker/types';

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
      const instance = Comlink.wrap<ItemsSource>(worker);

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

      await instance.init(Comlink.proxy(hostApi));

      return instance;
    })().catch((err) => {
      globalThis.__itemsSourcePromise = undefined;
      throw err;
    });
  }

  return globalThis.__itemsSourcePromise;
};
