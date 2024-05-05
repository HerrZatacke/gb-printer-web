import { State } from '../../app/store/State';

export interface GetSettingsOptions {
  lastUpdateUTC?: number,
  selectedFrameGroup?: string,
}

// properties containing tokens/passwords etc must get removed before exporting
export interface NoExport {
  gitStorage?: undefined,
  dropboxStorage?: undefined,
  printerUrl?: undefined,
}

export interface ExportableState extends Omit<Partial<State>, keyof NoExport> {
  lastUpdateUTC?: number,
}
