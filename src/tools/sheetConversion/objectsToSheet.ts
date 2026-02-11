import { HASH_COLUMN_NAME } from '@/contexts/GapiSheetStateContext/consts';
import { hashRow } from '@/contexts/GapiSyncContext/tools/hashRow';
import { UNDEFINED } from '@/tools/sheetConversion/consts';
import { type ColumnSpec } from '@/tools/sheetConversion/types';
import { serialize } from '@/tools/sheetConversion/values';

interface ToSheetOptions<T> {
  columns: ColumnSpec<T>[];
  remoteHashes?: string[];
  remoteHeaders?: string[];
}

interface ObjectsToSheetResult {
  sheetHeaders: string[];
  newSheetItems: string[][];
  deleteIndices: number[];
  keyIndex: number;
}

const MAX_CELL_SIZE = 50000;

const dedupeByColumnIndex = (values: string[][], columnIndex: number): string[][] => {
  const seen = new Set<string>();

  return values.filter(row => {
    const key = row[columnIndex];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const objectsToSheet = async <T extends object>(
  objects: T[],
  options: ToSheetOptions<T>,
): Promise<ObjectsToSheetResult> => {
  const { columns, remoteHashes = [], remoteHeaders = [] } = options;
  const sheetHeaders = [...remoteHeaders];

  columns.forEach(column => {
    const columnHeader = column.column;

    if (columnHeader === HASH_COLUMN_NAME) {
      throw new Error(`Column headers contain illegal name (${HASH_COLUMN_NAME})`);
    }

    if (!sheetHeaders.includes(columnHeader)) {
      sheetHeaders.push(columnHeader);
    }
  });

  if (!sheetHeaders.includes(HASH_COLUMN_NAME)) {
    sheetHeaders.unshift(HASH_COLUMN_NAME);
  }


  const headerIndices = new Map(sheetHeaders.map((headerName, idx) => [headerName, idx]));
  const hashHeaderIndices = new Map(columns.map((column, idx) => [column.column, idx]));
  const newItems: string[][] = [];
  const remoteHashSet = new Set<string>(remoteHashes);
  const keyColumn = columns[0];
  const keyIndex = headerIndices.get(keyColumn.column);
  if (!keyColumn || typeof keyIndex === 'undefined') {
    throw new Error('No columns');
  }


  for (const obj of objects) {
    const id = (obj as T)[keyColumn.prop];
    if (typeof id !== 'string') {
      throw new Error('Key must be a string');
    }

    const row = Array(sheetHeaders.length).fill(UNDEFINED);
    const rowToHash = Array(sheetHeaders.length).fill(UNDEFINED); // use order of config default header order for creating hash value

    // Populate the row with data
    for (const col of columns) {
      const value = col.prop in obj ? (obj as T)[col.prop] : undefined;
      const cellValue = serialize(value, col.type, col.fallbackType);

      if (cellValue.length >= MAX_CELL_SIZE) {
        throw new Error('Cell content is too big');
      }

      row[headerIndices.get(col.column)!] = cellValue;
      rowToHash[hashHeaderIndices.get(col.column)!] = cellValue;
    }

    const hash = await hashRow(rowToHash);
    row[headerIndices.get(HASH_COLUMN_NAME)!] = hash;

    // row is not known in remote dataset -> needs to be added
    if (!remoteHashSet.has(hash)) {
      newItems.push(row);
    }

    // in case row is known, remove from remoteHashSet -> all remaining will be listed in deleteIndices
    remoteHashSet.delete(hash);
  }

  const deleteIndices: number[] = [];
  remoteHashes.forEach((hash, idx) => {
    if (remoteHashSet.has(hash)) {
      deleteIndices.push(idx);
    }
  });

  return {
    sheetHeaders,
    newSheetItems: dedupeByColumnIndex(newItems, keyIndex),
    deleteIndices: [...new Set(deleteIndices)].sort((a, b) => b - a),
    keyIndex,
  };
};
