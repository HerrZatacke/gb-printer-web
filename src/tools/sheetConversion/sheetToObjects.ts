import { type ColumnSpec } from '@/tools/sheetConversion/types';
import { deserialize } from '@/tools/sheetConversion/values';

export function sheetToObjects<T extends object>(
  sheet: string[][],
  options: { columns: ColumnSpec<T>[] },
): T[] {
  const [headers, ...rows] = sheet;
  const { columns } = options;


  return rows.map((row) => {
    const obj: Record<string, unknown> = {};

    columns.forEach((col) => {

      const columnIndex = headers.indexOf(col.column);

      if (columnIndex === -1) {
        throw new Error(`cannot find column ${col.column} in sheet`);
      }

      const value = deserialize(
        row[columnIndex],
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
