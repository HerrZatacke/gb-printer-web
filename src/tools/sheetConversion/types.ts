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
