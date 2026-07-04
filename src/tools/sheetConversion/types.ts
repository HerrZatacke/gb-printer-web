import { SheetName } from '@/contexts/GapiSheetStateContext/consts';

export const ColumnType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
} as const;
export type ColumnType = (typeof ColumnType)[keyof typeof ColumnType];

export interface ColumnSpec<T> {
  prop: keyof T;
  column: string;
  type: ColumnType;
  fallbackType?: ColumnType;
}

export interface PushOptions {
  newLastUpdateValue: number;
  sort: boolean;
  chunkSize: number;
}

export interface UpdaterOptions<T> {
  sheetsClient: typeof gapi.client.sheets;
  sheetId: string;
  columns: ColumnSpec<T>[];
  sheetName: SheetName;
}
