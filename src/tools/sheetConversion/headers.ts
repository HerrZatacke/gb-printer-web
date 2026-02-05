import { ColumnType } from '@/tools/sheetConversion/types';

export const encodeHeader = (name: string, type: ColumnType): string => {
  return `${name}::${type}`;
};

export const decodeHeader = (header: string): { name: string; type: ColumnType } => {
  const [name, type] = header.split('::');
  if (!name || !type) {
    throw new Error(`Invalid header: ${header}`);
  }
  return { name, type: type as ColumnType };
};
