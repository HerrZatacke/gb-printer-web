import { PaletteSchema } from 'gb-printer-schemas';
import { FrameSchema } from 'gb-printer-schemas';
import { FrameGroupSchema } from 'gb-printer-schemas';
import { PluginSchema } from 'gb-printer-schemas';
import {
  openDB,
  type IDBPDatabase,
  type StoreNames,
  type StoreValue,
} from 'idb';
import { type ZodSafeParseResult } from 'zod';
import {
  StoredImageSchema,
  StoredSerializableImageGroupSchema,
} from '@/workers/itemsIndexedDbWorker/schemas';
import {
  type AfterUpgradeFn,
  type ItemsDB,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

const OLD_DB_NAME = 'GB Printer Web';
const OLD_BINARY_FRAMES_STORE = 'gb-printer-web-frames';
const OLD_BINARY_IMAGES_STORE = 'gb-printer-web-images';
const OLD_FRAMES_STORE = 'gb-printer-web--items--frames';
const OLD_FRAMEGROUPS_STORE = 'gb-printer-web--items--framegroups';
const OLD_IMAGES_STORE = 'gb-printer-web--items--images';
const OLD_IMAGEGROUPS_STORE = 'gb-printer-web--items--imagegroups';
const OLD_PALETTES_STORE = 'gb-printer-web--items--palettes';
const OLD_PLUGINS_STORE = 'gb-printer-web--items--plugins';

export const v1LegacyData: AfterUpgradeFn = async (
  upgradedDatabase: IDBPDatabase<ItemsDB>,
  hostApi: ItemsHostApi,
) => {
  const oldDb = await openDB(OLD_DB_NAME);
  let olderLegacyData: Record<string, unknown[]> | null = null;

  const updateFromLegacyData = async <S extends StoreNames<ItemsDB>>(
    oldStoreName: string,
    olderLegacyKey: string,
    parser: (raw: unknown) => ZodSafeParseResult<StoreValue<ItemsDB, S>>,
    storeName: StoreNames<ItemsDB>,
  ) => {
    let oldData: unknown[];
    try {
      const legacyTx = oldDb.transaction(oldStoreName, 'readonly');
      const legacyStore = legacyTx.store;
      oldData = await legacyStore.getAll();
      await legacyTx.done;
    } catch {
      olderLegacyData = olderLegacyData || await hostApi.getLegacyStorage(); // fallback to even older storage solution in localStorage
      oldData = olderLegacyData[olderLegacyKey] || [];
    }

    const tx = upgradedDatabase.transaction(storeName, 'readwrite');
    for (const raw of oldData) {
      const result = parser(raw);
      if (!result.success) {
        console.log({
          result,
          raw,
        });
        throw result.error;
      }

      await tx.store.put(result.data);
    }

    await tx.done;
  };

  const updateFromLegacyBinaryData = async (
    oldStoreName: string,
    storeName: StoreNames<ItemsDB>,
  ) => {
    const oldData: { key: string; value: string }[] = [];
    try {
      const legacyTx = oldDb.transaction(oldStoreName, 'readonly');
      const legacyStore = legacyTx.store;

      let cursor = await legacyStore.openCursor();
      while (cursor) {
        oldData.push({
          key: cursor.key as string,
          value: cursor.value,
        });
        cursor = await cursor.continue();
      }
      await legacyTx.done;
    } catch {
      console.warn(`Did not copy binary data from ${oldStoreName}. Store probably does not exist.`);
      return;
    }

    const tx = upgradedDatabase.transaction(storeName, 'readwrite');
    for (const { key, value } of oldData) {
      if (typeof value !== 'string') {
        throw new Error('Skipping invalid binary item during migration');
      }

      // localForage relic
      if (key.startsWith('dummy')) {
        continue;
      }

      await tx.store.put(value, key as string);
    }

    await tx.done;
  };

  try {
    await updateFromLegacyBinaryData(OLD_BINARY_FRAMES_STORE, 'binaryframes');
    await updateFromLegacyBinaryData(OLD_BINARY_IMAGES_STORE, 'binaryimages');
    await updateFromLegacyData(OLD_FRAMES_STORE, 'frames', FrameSchema.safeParse, 'frames');
    await updateFromLegacyData(OLD_FRAMEGROUPS_STORE, 'frameGroups', FrameGroupSchema.safeParse, 'framegroups');
    await updateFromLegacyData(OLD_IMAGES_STORE, 'images', StoredImageSchema.safeParse, 'images');
    await updateFromLegacyData(OLD_IMAGEGROUPS_STORE, 'imageGroups', StoredSerializableImageGroupSchema.safeParse, 'imagegroups');
    await updateFromLegacyData(OLD_PALETTES_STORE, 'palettes', PaletteSchema.safeParse, 'palettes');
    await updateFromLegacyData(OLD_PLUGINS_STORE, 'plugins', PluginSchema.safeParse, 'plugins');
  } finally {
    oldDb.close();
  }
};
