import {
  openDB,
  type IDBPDatabase,
  type StoreNames,
  type StoreValue,
} from 'idb';
import { type ZodSafeParseResult } from 'zod';
import { FrameSchema } from '@/types/Frame';
import { FrameGroupSchema } from '@/types/FrameGroup';
import { NewSerializableImageGroupSchema } from '@/types/ImageGroup';
import { PaletteSchema } from '@/types/Palette';
import { PluginSchema } from '@/types/Plugin';
import {
  type AfterUpgradeFn,
  type ItemsDB,
  type ItemsHostApi,
  StoredImageSchema,
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
    const legacyTx = oldDb.transaction(oldStoreName, 'readonly');
    const legacyStore = legacyTx.store;

    let oldData: unknown[];
    try {
      oldData = await legacyStore.getAll();
    } catch {
      olderLegacyData = olderLegacyData || await hostApi.getLegacyStorage(); // fallback to even older storage solution in localStorage
      oldData = olderLegacyData[olderLegacyKey] || [];
    }

    const tx = upgradedDatabase.transaction(storeName, 'readwrite');
    for (const raw of oldData) {
      const result = parser(raw);
      if (!result.success) {
        throw result.error;
      }

      await tx.store.put(result.data);
    }

    await Promise.all([tx.done, legacyTx.done]);
  };

  const updateFromLegacyBinaryData = async (
    oldStoreName: string,
    storeName: StoreNames<ItemsDB>,
  ) => {
    const legacyTx = oldDb.transaction(oldStoreName, 'readonly');
    const legacyStore = legacyTx.store;

    let cursor = await legacyStore.openCursor();
    const oldData: { key: string; value: string }[] = [];
    while (cursor) {
      oldData.push({
        key: cursor.key as string,
        value: cursor.value,
      });
      cursor = await cursor.continue();
    }

    const tx = upgradedDatabase.transaction(storeName, 'readwrite');
    for (const { key, value } of oldData) {
      if (typeof value !== 'string') {
        throw new Error('Skipping invalid binary item during migration');
      }

      await tx.store.put(value, key as string);
    }

    await Promise.all([tx.done, legacyTx.done]);
  };

  try {
    await updateFromLegacyBinaryData(OLD_BINARY_FRAMES_STORE, 'binaryframes');
    await updateFromLegacyBinaryData(OLD_BINARY_IMAGES_STORE, 'binaryimages');
    await updateFromLegacyData(OLD_FRAMES_STORE, 'frames', FrameSchema.safeParse, 'frames'); // ToDo: add "lines" and "hash" properties if missing
    await updateFromLegacyData(OLD_FRAMEGROUPS_STORE, 'frameGroups', FrameGroupSchema.safeParse, 'framegroups');
    await updateFromLegacyData(OLD_IMAGES_STORE, 'images', StoredImageSchema.safeParse, 'images'); // ToDo: add "lines" property if missing (could happen in StoredImageSchema.transform)
    await updateFromLegacyData(OLD_IMAGEGROUPS_STORE, 'imageGroups', NewSerializableImageGroupSchema.safeParse, 'imagegroups');
    await updateFromLegacyData(OLD_PALETTES_STORE, 'palettes', PaletteSchema.safeParse, 'palettes');
    await updateFromLegacyData(OLD_PLUGINS_STORE, 'plugins', PluginSchema.safeParse, 'plugins');
  } catch (err) {
    console.error('error during v1 migration:', err);
  } finally {
    oldDb.close();
  }
};
