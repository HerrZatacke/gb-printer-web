import filesize from 'filesize';
import localforage from 'localforage';
import { hash as ohash } from 'ohash';
import { createJSONStorage, PersistStorage } from 'zustand/middleware';
import { StorageValue } from 'zustand/middleware/persist';
import { type Values } from '@/stores/itemsStore';
import sortBy from '@/tools/sortby';
import { type Frame } from '@/types/Frame';
import { type FrameGroup } from '@/types/FrameGroup';
import { type Image } from '@/types/Image';
import { type SerializableImageGroup } from '@/types/ImageGroup';
import { type Palette } from '@/types/Palette';
import { type Plugin } from '@/types/Plugin';

interface WrappedForage<T> {
  setData: (items: T[]) => Promise<void>;
  loadData: () => Promise<T[]>;
  dropDB: () => Promise<void>;
}

const wrapForage = <FT>(storeName: string, keyField: keyof FT): WrappedForage<FT> => {
  const instance = localforage.createInstance({
    name: 'GB Printer Web',
    storeName,
  });

  return {
    async dropDB(): Promise<void> {
      await instance.dropInstance();
    },

    async loadData(): Promise<FT[]> {
      const items: FT[] = [];
      await instance.iterate((value: FT) => {
        items.push(value);
      });

      return items;
    },

    async setData(items: FT[]): Promise<void> {
      // build a hash map of existing data
      const existing = new Map<string, string>();
      await instance.iterate((value: FT, dbId) => {
        existing.set(ohash(value || null), dbId);
      });

      // update or add new/changed items if hash of an item does not exist
      for (const item of items) {
        const dbId = String(item[keyField]);
        const itemHash = ohash(item || null);

        if (existing.has(itemHash)) {
          existing.delete(itemHash); // item is unchanged
        } else {
          await instance.setItem(dbId, item); // item is new or changed
        }
      }

      // remove deleted items
      if (existing.size > 0) {
        await Promise.all(Array.from(existing.values()).map((dbId) => instance.removeItem(dbId)));
      }
    },
  };
};

export const createSplitStorage = (prefix: string): PersistStorage<Values> => {
  const framesStore = wrapForage<Frame>(`${prefix}--frames`, 'id');
  const frameGroupsStore = wrapForage<FrameGroup>(`${prefix}--framegroups`, 'id');
  const imagesStore = wrapForage<Image>(`${prefix}--images`, 'hash');
  const imageGroupsStore = wrapForage<SerializableImageGroup>(`${prefix}--imagegroups`, 'id');
  const palettesStore = wrapForage<Palette>(`${prefix}--palettes`, 'shortName');
  const pluginsStore = wrapForage<Plugin>(`${prefix}--plugins`, 'url');

  const sortByShortName = sortBy<Palette>('shortName');
  const sortByTitle = sortBy<Plugin>('name');
  const sortById = sortBy<Frame>('id');
  const sortBySlug = sortBy<SerializableImageGroup>('slug');

  const unloadHandler = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = ''; // Required for Chrome
  };

  const rootStore = localforage.createInstance({
    name: 'GB Printer Web',
    storeName: 'gb-printer-web--items--root',
  });

  // used to prevent concurrent tasks
  // only first and last taske are executed
  let nextStorageValue: StorageValue<Values> | null = null;
  let busy = false;

  const storeRootData = async (storageValue: StorageValue<Values>): Promise<void> => {
    if (busy) {
      nextStorageValue = storageValue;
      return ;
    }

    window.addEventListener('beforeunload', unloadHandler);

    busy = true;

    console.log('start storing items');
    const start = performance.now();

    const { state, version } = storageValue;

    // sequentially saving seems to be slightly faster than Promise.all([...]);
    await rootStore.setItem('version', version);
    await frameGroupsStore.setData(state.frameGroups);
    await framesStore.setData(state.frames);
    await imagesStore.setData(state.images);
    await imageGroupsStore.setData(state.imageGroups);
    await palettesStore.setData(state.palettes);
    await pluginsStore.setData(state.plugins);

    console.log(`saved in ${(performance.now() - start).toFixed(2)}ms`);

    busy = false;

    if (nextStorageValue) {
      const next = nextStorageValue;
      nextStorageValue = null;
      await storeRootData(next);
    }

    window.removeEventListener('beforeunload', unloadHandler);
  };

  const loadRootData = async (): Promise<{
    state: Values,
    version: number,
  } | null> => {
    const version = await rootStore.getItem<number>('version');

    if (typeof version !== 'number') { return null; }

    console.log('start loading items');
    const start = performance.now();

    const state: Values = {
      frameGroups: await frameGroupsStore.loadData(), // sorted later in useFrameGroups-hook
      frames: sortById(await framesStore.loadData()),
      imageGroups: sortBySlug(await imageGroupsStore.loadData()),
      images: await imagesStore.loadData(),
      palettes: sortByShortName(await palettesStore.loadData()),
      plugins: sortByTitle(await pluginsStore.loadData()),
    };

    console.log(`loaded in ${(performance.now() - start).toFixed(2)}ms`);

    return {
      state,
      version,
    };
  };

  const jsonStorage = createJSONStorage(() => localStorage) as PersistStorage<Values>;

  return ({
    async getItem(name: string): Promise<StorageValue<Values> | null> {
      const [
        loadedIndexedDB,
        loadedJsonStorage,
      ] = await Promise.all([
        loadRootData(),
        jsonStorage.getItem(name),
      ]);

      if (loadedIndexedDB?.state.images.length !== loadedJsonStorage?.state.images.length) {
        console.warn(`indexedDB images: ${loadedIndexedDB?.state.images.length}\njsonStorage images: ${loadedJsonStorage?.state.images.length}`);
      }

      // jsonStorage fallback, to be removed later
      if (!loadedIndexedDB) {
        console.warn('could not load items from indexedDB - falling back to localStorage');
        return loadedJsonStorage;
      }

      return loadedIndexedDB;
    },

    async setItem (name: string, storageValue: StorageValue<Values> ): Promise<void> {
      // For later:
      // try {
      //   await storeRootData(storageValue);
      //   jsonStorage.removeItem(name);
      // } catch {
      //   jsonStorage.setItem(name, storageValue);
      // }

      console.log(`Items storage will use roughly ${filesize(JSON.stringify(storageValue).length)}`);

      const results = await Promise.allSettled([
        Promise.resolve().then(() => jsonStorage.setItem(name, storageValue)),
        storeRootData(storageValue),
      ]);

      if (results[0].status === 'rejected') {
        console.warn('Error: jsonStorage.setItem failed:', results[0].reason);
      }

      if (results[1].status === 'rejected') {
        console.warn('Error: storeRootData failed:', results[1].reason);
      }
    },

    async removeItem (): Promise<void> {
      await Promise.all([
        frameGroupsStore.dropDB(),
        framesStore.dropDB(),
        imageGroupsStore.dropDB(),
        imagesStore.dropDB(),
        palettesStore.dropDB(),
        pluginsStore.dropDB(),
        rootStore.dropInstance(),
      ]);
    },
  });
};
