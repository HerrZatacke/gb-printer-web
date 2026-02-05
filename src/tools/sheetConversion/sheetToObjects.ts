import { decodeHeader } from '@/tools/sheetConversion/headers';
import { deserialize } from '@/tools/sheetConversion/values';

export const sheetToObjects = <T extends object>(
  sheet: string[][],
  key: keyof T,
): T[] => {
  const [headers, ...rows] = sheet;
  const decodedHeaders = headers.map(decodeHeader);

  return rows.map(row => {
    const obj: Record<string, unknown> = {};

    decodedHeaders.forEach(({ name, type }, i) => {
      const value = deserialize(row[i], type);
      if (value !== undefined) {
        obj[name] = value;
      }
    });

    if (typeof obj[key as string] !== 'string') {
      throw new Error(`Missing key ${String(key)}`);
    }

    return obj as T;
  });
};
