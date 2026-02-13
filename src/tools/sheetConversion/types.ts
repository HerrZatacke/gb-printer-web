import { SheetName } from '@/contexts/GapiSheetStateContext/consts';

export enum ColumnType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

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
