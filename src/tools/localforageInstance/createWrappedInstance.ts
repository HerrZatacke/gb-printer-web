import localforage from 'localforage';
import { type SheetName } from '@/contexts/GapiSheetStateContext/consts';
import { BinaryGapiSyncItem } from '@/contexts/GapiSyncContext/tools/types';
import { useItemsStore } from '@/stores/stores';
import { reduceItems } from '@/tools/reduceArray';

export interface WrappedLocalForageInstance<T> {
  ready: () => Promise<void>,
  keys: () => Promise<string[]>,
  driver: () => Promise<string>,
  setItem: (key: string, value: T) => Promise<T>,
  getItem: (key: string) => Promise<T | null>,
  removeItem: (key: string) => Promise<void>,
  getSyncItems: () => Promise<BinaryGapiSyncItem[]>,
  setSyncItems: (items: BinaryGapiSyncItem[], merge: boolean) => Promise<void>,
}

const DUMMY = `dummy${(new Date()).getTime()}`;

const createWrappedInstance = <T>(options: LocalForageOptions, lastUpdateSheetName: SheetName): WrappedLocalForageInstance<T> => {
  let instance = localforage.createInstance(options);

  const createDummys = async () => {
    await instance.setItem(DUMMY, DUMMY);
    await instance.removeItem(DUMMY);
  };

  return {
    ready: async (): Promise<void> => {
      try {
        await instance.ready();
        return createDummys();
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    keys: async (): Promise<string[]> => {
      try {
        return instance.keys();
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    driver: async (): Promise<string> => {
      try {
        return await instance.driver();
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    setItem: async (key: string, value: T): Promise<T> => {
      try {
        const item = await instance.setItem(key, value);
        useItemsStore.getState().setLastUpdate(lastUpdateSheetName);
        return item;
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    getItem: async (key: string): Promise<T | null> => {
      try {
        return await instance.getItem<T>(key);
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }

    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await instance.removeItem(key);
        useItemsStore.getState().setLastUpdate(lastUpdateSheetName);
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    getSyncItems: async (): Promise<BinaryGapiSyncItem[]> => {
      try {
        const keys = await instance.keys();

        const allItems = await Promise.all(keys.map(async (key): Promise<BinaryGapiSyncItem | null> => {
          const data = await instance.getItem<string | null>(key);
          if (typeof data !== 'string') {
            return null;
          }

          return { hash: key, data: btoa(data) };
        }));

        return allItems.reduce(reduceItems<BinaryGapiSyncItem>, []);
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
    setSyncItems: async (items: BinaryGapiSyncItem[], merge: boolean): Promise<void> => {
      const syncedHashes = new Set<string>();
      try {
        for (const { hash, data } of items) {
          await instance.setItem(hash, atob(data));
          syncedHashes.add(hash);
        }

        if (!merge) {
          const keys = await instance.keys();
          const toDelete = keys.filter((key) => !syncedHashes.has(key));

          console.log((await instance.keys()).length);

          for (const hash of toDelete) {
            console.log(`deleting ${hash}`);
            await instance.removeItem(hash);
          }

          console.log((await instance.keys()).length);
        }
      } catch (error) {
        instance = localforage.createInstance(options);
        throw error;
      }
    },
  };
};

export default createWrappedInstance;
