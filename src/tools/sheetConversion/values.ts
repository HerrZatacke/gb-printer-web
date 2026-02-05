import { NULL, UNDEFINED, TRUE, FALSE } from '@/tools/sheetConversion/consts';
import { ColumnType } from '@/tools/sheetConversion/types';

export const serialize = (value: unknown, type: ColumnType): string => {
  if (value === undefined) return UNDEFINED as string;
  if (value === null) return NULL as string;

  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      return String(value);
    case 'boolean':
      return value ? TRUE : FALSE;
    case 'json':
    default:
      return JSON.stringify(value);
  }
};

export const deserialize = (value: string, type: ColumnType): unknown => {
  if (value === UNDEFINED) return undefined;
  if (value === NULL) return null;

  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value === TRUE;
    case 'json':
      return JSON.parse(value);
    case 'string':
    default:
      return value;
  }
};
