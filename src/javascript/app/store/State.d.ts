import type { Dispatch, MiddlewareAPI } from 'redux';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { Plugin } from '../../../types/Plugin';
import type { PickColors } from '../../../types/PickColors';

// ToDo: infer from store somehow...?
export interface State {
  editImage: CurrentEditBatch | null,
  editFrame: string | null,
  editPalette: Palette | null,
  editRGBNImages: string[],
  frameGroupNames: FrameGroup[],
  frames: Frame[],
  images: Image[],
  palettes: Palette[],
  pickColors: PickColors | null,
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
