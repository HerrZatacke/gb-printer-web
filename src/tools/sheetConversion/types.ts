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

export interface UpdaterOptionsDynamic {
  sheetsClient: typeof gapi.client.sheets;
  sheetId: string;
}

export interface UpdaterOptionsStatic<T> {
  columns: ColumnSpec<T>[];
  keyColumn: keyof T;
  sheetName: SheetName;
}
