import { NULL, UNDEFINED, TRUE, FALSE } from '@/tools/sheetConversion/consts';
import { ColumnType } from '@/tools/sheetConversion/types';

const isCompatible = (value: unknown, type: ColumnType): boolean => {
  if (value === null || value === undefined) return true;

  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'json':
      return typeof value === 'object';
    default:
      return false;
  }
};

export const decodeByType = (value: string, type: ColumnType): unknown => {
  switch (type) {
    case ColumnType.STRING:
      return value;
    case ColumnType.NUMBER: {
      const n = Number(value);
      if (Number.isNaN(n)) throw new Error();
      return n;
    }
    case ColumnType.BOOLEAN:
      if (value === TRUE) return true;
      if (value === FALSE) return false;
      throw new Error();
    case ColumnType.JSON:
      return JSON.parse(value);
  }
};

export const serialize = (
  value: unknown,
  type: ColumnType,
  fallbackType?: ColumnType,
): string => {
  if (value === undefined) return UNDEFINED as string;
  if (value === null) return NULL as string;

  const typeToUse: ColumnType = isCompatible(value, type) ? type : fallbackType ?? type;

  switch (typeToUse) {
    case ColumnType.STRING:
      return String(value);
    case ColumnType.NUMBER:
      return String(value);
    case ColumnType.BOOLEAN:
      return value ? TRUE : FALSE;
    case ColumnType.JSON:
    default:
      return JSON.stringify(value);
  }
};

export const deserialize = (
  value: string,
  type: ColumnType,
  fallbackType?: ColumnType,
): unknown => {
  if (value === UNDEFINED) return undefined;
  if (value === NULL) return null;

  try {
    return decodeByType(value, type);
  } catch {
    if (!fallbackType) throw new Error(`No fallbackType for value "${value}"`);
    return decodeByType(value, fallbackType);
  }
};
