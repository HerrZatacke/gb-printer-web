import {
  type SQLiteColumn,
  type SQLiteTable,
} from 'drizzle-orm/sqlite-core';
import  {
  StoreNames,
} from 'gb-items-source';
import {
  imageReferences,
  imageTags,
} from '@/db/schema';

interface IndexDefinition {
  table: SQLiteTable;
  ownerColumn: SQLiteColumn;
  valueColumn: SQLiteColumn;
}

export const indexesByStoreName: Partial<Record<StoreNames, Record<string, IndexDefinition>>> = {
  [StoreNames.IMAGES]: {
    tags: { table: imageTags, ownerColumn: imageTags.imageHash, valueColumn: imageTags.tag },
    referencedHashes: { table: imageReferences, ownerColumn: imageReferences.sourceHash, valueColumn: imageReferences.referencedHash },
  },
};
