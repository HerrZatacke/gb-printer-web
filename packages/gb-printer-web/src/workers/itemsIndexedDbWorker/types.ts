import { type ItemsSource } from 'gb-items-source';
import {
  ItemStoreNames,
  type Frame,
  type FrameGroup,
  type Palette,
  type Plugin,
  type SpecialTags,
  type StoredImage,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import { type DBSchema, type IDBPDatabase, type IDBPTransaction, type StoreNames } from 'idb';

export interface ItemsDB extends DBSchema {
  [ItemStoreNames.BINARYFRAMES]: {
    key: string;
    value: string;
  };
  [ItemStoreNames.BINARYIMAGES]: {
    key: string;
    value: string;
  };
  [ItemStoreNames.FRAMES]: {
    key: string;
    value: Frame;
    indexes: {
      hash: string;
    };
  };
  [ItemStoreNames.FRAMEGROUPS]: {
    key: string;
    value: FrameGroup;
  };
  [ItemStoreNames.IMAGES]: {
    key: string;
    value: StoredImage;
    indexes: {
      tags: string;
      referencedHashes: string;
    };
  };
  [ItemStoreNames.IMAGEGROUPS]: {
    key: string;
    value: StoredSerializableImageGroup;
  };
  [ItemStoreNames.PALETTES]: {
    key: string;
    value: Palette;
  };
  [ItemStoreNames.PLUGINS]: {
    key: string;
    value: Plugin;
  };
}

export interface ItemsHostApi {
  getLegacyStorage(): Promise<Record<string, unknown[]>>;
  onMigrationError(message: string): void;
}

export type AfterUpgradeFn =  (upgradedDatabase: IDBPDatabase<ItemsDB>, hostApi: ItemsHostApi) => Promise<void>;

export type MigrationFn = (
  db: IDBPDatabase<ItemsDB>,
  tx: IDBPTransaction<ItemsDB, StoreNames<ItemsDB>[], 'versionchange'>,
) => AfterUpgradeFn | null;

export interface FilterableFacet {
  tags: string[];
  specialTags: SpecialTags[];
  palettes: string[];
  frames: string[];
}

export type InitWorkerFn = (hostApi: ItemsHostApi) => Promise<ItemsSource>;
