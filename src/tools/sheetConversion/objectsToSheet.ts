import { HASH_COLUMN_NAME } from '@/contexts/GapiSheetStateContext/consts';
import { hashRow } from '@/contexts/GapiSyncContext/tools/hashRow';
import { UNDEFINED } from '@/tools/sheetConversion/consts';
import { type ColumnSpec } from '@/tools/sheetConversion/types';
import { serialize } from '@/tools/sheetConversion/values';

interface ToSheetOptions<T> {
  key: keyof T;
  columns: ColumnSpec<T>[];
  existing?: string[][];
  deleteMissing?: boolean;
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
): Promise<string[][]> => {
  const { key, columns, existing, deleteMissing = false } = options;

  const headers = columns.map(column => column.column);

  if (headers.includes(HASH_COLUMN_NAME)) {
    throw new Error(`Headers contain illegal name (${HASH_COLUMN_NAME})`);
  }

  headers.unshift(HASH_COLUMN_NAME);

  const index = new Map(headers.map((headerName, idx) => [headerName, idx]));

  let rows: string[][] = existing ? existing.slice(1).map(r => [...(r.slice(0, headers.length))]) : [];

  const keyColumn = columns.find(c => c.prop === key);
  if (!keyColumn) {
    throw new Error('Key must be included in columns');
  }

  const keyIndex = index.get(keyColumn.column)!;
  const rowByKey = new Map<string, string[]>();

  rows.forEach(r => rowByKey.set(r[keyIndex], r));

  const seen = new Set<string>();

  for (const obj of objects) {
    const id = (obj as T)[key];
    if (typeof id !== 'string') {
      throw new Error('Key must be a string');
    }

    seen.add(id);

    let row = rowByKey.get(id);
    if (!row) {
      row = Array(headers.length).fill(UNDEFINED);
      rows.push(row);
      rowByKey.set(id, row);
    }

    for (const col of columns) {
      const value = col.prop in obj ? (obj as T)[col.prop] : undefined;
      const cellValue = serialize(value, col.type, col.fallbackType);

      if (cellValue.length >= MAX_CELL_SIZE) {
        throw new Error('Cell content is too big');
      }

      row[index.get(col.column)!] = cellValue;
    }

    const hash = await hashRow(row);
    row[index.get(HASH_COLUMN_NAME)!] = hash;
  }

  if (deleteMissing) {
    rows = rows.filter(r => seen.has(r[keyIndex]));
  }

  rows = dedupeByColumnIndex(rows, keyIndex);

  return [headers, ...rows];
};
