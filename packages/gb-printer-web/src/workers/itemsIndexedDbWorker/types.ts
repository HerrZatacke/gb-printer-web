import { type ItemsSource } from 'gb-items-source';
import {
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
  binaryframes: {
    key: string;
    value: string;
  };
  binaryimages: {
    key: string;
    value: string;
  };
  frames: {
    key: string;
    value: Frame;
    indexes: {
      hash: string;
    };
  };
  framegroups: {
    key: string;
    value: FrameGroup;
  };
  images: {
    key: string;
    value: StoredImage;
    indexes: {
      tags: string;
      referencedHashes: string;
    };
  };
  imagegroups: {
    key: string;
    value: StoredSerializableImageGroup;
  };
  palettes: {
    key: string;
    value: Palette;
  };
  plugins: {
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

export type InitWorkerFn = (hostApi: ItemsHostApi, remoteStorageUrl: string) => Promise<ItemsSource>;
