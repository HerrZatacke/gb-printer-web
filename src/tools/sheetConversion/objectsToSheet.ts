import { UNDEFINED } from '@/tools/sheetConversion/consts';
import { decodeHeader, encodeHeader } from '@/tools/sheetConversion/headers';
import { ColumnType } from '@/tools/sheetConversion/types';
import { serialize } from '@/tools/sheetConversion/values';

interface ToSheetOptions<T> {
  key: keyof T;
  existing?: string[][];
  deleteMissing?: boolean;
}

export const objectsToSheet = <T extends object>(
  objects: T[],
  options: ToSheetOptions<T>,
): string[][] => {
  const { key, existing, deleteMissing = false } = options;

  const columnTypes = new Map<string, ColumnType>();

  // Infer types from objects
  for (const obj of objects) {
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;

      if (typeof v === 'string') columnTypes.set(k, ColumnType.STRING);
      else if (typeof v === 'number') columnTypes.set(k, ColumnType.NUMBER);
      else if (typeof v === 'boolean') columnTypes.set(k, ColumnType.BOOLEAN);
      else columnTypes.set(k, ColumnType.JSON);
    }
  }

  let headers: string[] = [];
  let rows: string[][] = [];

  if (existing?.length) {
    headers = [...existing[0]];
    rows = existing.slice(1).map(r => [...r]);

    for (const h of headers) {
      const { name, type } = decodeHeader(h);
      columnTypes.set(name, type);
    }
  }

  // Ensure key column exists
  if (!columnTypes.has(key as string)) {
    columnTypes.set(key as string, ColumnType.STRING);
  }

  // Build headers
  headers = [...columnTypes.entries()].map(([k, t]) => encodeHeader(k, t));

  const index = new Map(headers.map((h, i) => [decodeHeader(h).name, i]));
  const keyIndex = index.get(key as string)!;

  const rowByKey = new Map<string, string[]>();
  rows.forEach(r => rowByKey.set(r[keyIndex], r));

  const seen = new Set<string>();

  for (const obj of objects) {
    const id = obj[key];
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

    for (const [prop, type] of columnTypes) {
      if (prop in obj) {
        row[index.get(prop)!] = serialize(obj[prop as keyof T], type);
      } else {
        row[index.get(prop)!] = UNDEFINED;
      }
    }
  }

  if (deleteMissing) {
    rows = rows.filter(r => seen.has(r[keyIndex]));
  }

  return [headers, ...rows];
};
