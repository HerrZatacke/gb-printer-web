import {
  SQLiteColumn,
  type SQLiteTable,
} from 'drizzle-orm/sqlite-core';
import { ItemStoreNames } from 'gb-printer-schemas';
import {
  imageReferences,
  imageTags,
  frames,
} from '@/db/schema';

export interface IndexDefinition {
  indexTable: SQLiteTable;
  sourceFieldName: string;
  ownerFieldName: string;
  valueFieldName: string;
}

export interface WithColumns {
  ownerColumn: SQLiteColumn;
  valueColumn: SQLiteColumn;
}

export const indexesByStoreName: Partial<Record<ItemStoreNames, Record<string, IndexDefinition>>> = {
  [ItemStoreNames.IMAGES]: {
    tags: {
      indexTable: imageTags,
      sourceFieldName: 'tags',
      ownerFieldName: 'imageHash',
      valueFieldName: 'tag',
    },
    referencedHashes: {
      indexTable: imageReferences,
      sourceFieldName: 'referencedHashes',
      ownerFieldName: 'sourceHash',
      valueFieldName: 'referencedHash',
    },
  },
  [ItemStoreNames.FRAMES]: {
    hash: {
      indexTable: frames, // frames has just an extra index. No "external" index table for lookups.
      sourceFieldName: 'hash',
      ownerFieldName: 'id',
      valueFieldName: 'hash',
    },
  },
};
