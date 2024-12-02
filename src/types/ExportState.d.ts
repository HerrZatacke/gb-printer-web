import type { Values } from '../javascript/app/stores/itemsStore';

interface ExportableState extends Partial<Values> {
  lastUpdateUTC: number,
  version: number,
}

export interface JSONExportState {
  state: ExportableState,
}

export interface JSONExportBinary {
  [k: string]: string,
}


export type JSONExport = JSONExportState & JSONExportBinary;
