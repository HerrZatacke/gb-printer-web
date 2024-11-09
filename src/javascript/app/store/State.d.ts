import type { Dispatch, MiddlewareAPI } from 'redux';
import type { Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { Plugin } from '../../../types/Plugin';

// ToDo: infer from store somehow...?
export interface State {
  frameGroupNames: FrameGroup[],
  frames: Frame[],
  images: Image[],
  palettes: Palette[],
  plugins: Plugin[],
}

export type TypedStore = MiddlewareAPI<Dispatch, State>;

export interface ExportableState extends Partial<State> {
  lastUpdateUTC?: number,
}

export interface JSONExportState {
  state: ExportableState,
}

export interface JSONExportBinary {
  [k: string]: string,
}


export type JSONExport = JSONExportState & JSONExportBinary;
