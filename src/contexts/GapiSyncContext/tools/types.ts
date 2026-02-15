import { ColumnSpec } from '@/tools/sheetConversion/types';

export interface UpdateOptions<T> {
  sheetsClient: typeof gapi.client.sheets;
  sheetId: string;
  sheetName: string;
  columns: ColumnSpec<T>[];
  keyColumn: keyof T;
  newLastUpdateValue: number;
}

export interface BinaryGapiSyncItem {
  hash: string;
  data: string;
}
