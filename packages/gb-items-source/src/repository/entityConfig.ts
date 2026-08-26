import { ItemStoreNames } from 'gb-printer-schemas';
import { type RepositoryEntry } from '@/types';

export interface EntityConfig<TValue, TKey extends string = string> {
  storeName: ItemStoreNames;
  // true for keyPath stores (images, frames, imagegroups, palettes, plugins,
  // framegroups) where idb reads the key off the value itself.
  // false for out-of-line-key stores (binaryimages, binaryframes)
  hasKeyPath: boolean;
  // Only needed for keyPath stores, to build entries via toEntries() below.
  // Binary stores have no meaningful way to derive a key from their value
  keyOf?: (value: TValue) => TKey;
}

export const toEntries = <TValue, TKey extends string = string>(
  config: EntityConfig<TValue, TKey>,
  values: TValue[],
): RepositoryEntry<TValue, TKey>[] => {
  if (!config.keyOf) {
    throw new Error(`toEntries() requires keyOf on the entity config for store "${config.storeName}"`);
  }

  const keyOf = config.keyOf;
  return values.map((value) => ({ key: keyOf(value), value }));
};
