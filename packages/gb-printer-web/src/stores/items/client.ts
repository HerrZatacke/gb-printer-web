'use client';
import * as Comlink from 'comlink';
import { ItemsSource } from 'gb-items-source';
import {
  ItemStoreNames,
  type ItemsMutationReponse,
  type ItemsInvalidation,
} from 'gb-printer-schemas';
import { getQueryClient } from '@/contexts/QueryClient';
import { binaryFramesKeys } from '@/stores/items/queries/binaryFrames';
import { binaryImagesKeys } from '@/stores/items/queries/binaryImages';
import {
  frameGroupsKeys,
  framesKeys,
  imageGroupsKeys,
  imagesKeys,
  palettesKeys,
  pluginsKeys,
} from '@/stores/items/queries/cacheKeys';
import { useInteractionsStore } from '@/stores/stores';
import unique from '@/tools/unique';
import {
  type InitWorkerFn,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

declare global {
  var __itemsSourcePromise: Promise<ItemsSource> | undefined;
}

const runInvalidations = async (invalidations: ItemsInvalidation[]) => {
  const keys = unique<ItemStoreNames>(invalidations.map(({ collection }): ItemStoreNames => collection));
  const queryClient = getQueryClient();
  return keys.map(async (key: ItemStoreNames): Promise<void | void[]> => {
    switch (key) {
      case ItemStoreNames.IMAGES: {
        return queryClient.resetQueries({ queryKey: imagesKeys.all });
      }

      case ItemStoreNames.FRAMES: {
        return queryClient.invalidateQueries({ queryKey: framesKeys.all });
      }

      case ItemStoreNames.FRAMEGROUPS: {
        return queryClient.invalidateQueries({ queryKey: frameGroupsKeys.all });
      }

      case ItemStoreNames.IMAGEGROUPS: {
        return Promise.all([
          queryClient.resetQueries({ queryKey: imagesKeys.imagesByGroupKeys }),
          queryClient.resetQueries({ queryKey: imageGroupsKeys.all }),
        ]);
      }

      case ItemStoreNames.PALETTES: {
        return queryClient.invalidateQueries({ queryKey: palettesKeys.all });
      }

      case ItemStoreNames.PLUGINS: {
        return queryClient.invalidateQueries({ queryKey: pluginsKeys.all });
      }

      case ItemStoreNames.BINARYIMAGES: {
        return queryClient.invalidateQueries({ queryKey: binaryImagesKeys.all });
      }

      case ItemStoreNames.BINARYFRAMES: {
        return queryClient.invalidateQueries({ queryKey: binaryFramesKeys.all });
      }

      default:
        console.info(`unknown invalidation: "${key}"`);
    }
  });
};

const isMutationResult = (result: unknown): result is ItemsMutationReponse => {
  return typeof result === 'object' && result !== null && Array.isArray((result as { invalidations: unknown }).invalidations);
};

const withInvalidationDispatch = (source: ItemsSource): ItemsSource => {
  return new Proxy(source, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value !== 'function') {
        return value;
      }

      return async (...args: unknown[]) => {
        const result = await value.apply(target, args);

        if (isMutationResult(result)) {
          void runInvalidations(result.invalidations);
        }

        return result;
      };
    },
  });
};

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

      const debug = false;

      const instance = await initWorker(Comlink.proxy(hostApi), debug);
      return withInvalidationDispatch(instance);
    })().catch((err) => {
      globalThis.__itemsSourcePromise = undefined;
      throw err;
    });
  }

  return globalThis.__itemsSourcePromise;
};
