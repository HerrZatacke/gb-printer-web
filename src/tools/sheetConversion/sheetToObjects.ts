import { type ColumnSpec } from '@/tools/sheetConversion/types';
import { deserialize } from '@/tools/sheetConversion/values';

export function sheetToObjects<T extends object>(
  sheet: string[][],
  options: { columns: ColumnSpec<T>[] },
): T[] {
  const [, ...rows] = sheet;
  const { columns } = options;

  return rows.map((row) => {
    const obj: Record<string, unknown> = {};

    columns.forEach((col, i) => {
      const value = deserialize(
        row[i],
        col.type,
        col.fallbackType,
      );

      if (value !== undefined) {
        obj[col.prop as string] = value;
      }
    });

    return obj as T;
  });
}
