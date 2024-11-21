import type { Dispatch, MiddlewareAPI } from 'redux';
import type { Values } from '../stores/itemsStore';
import type { Image } from '../../../types/Image';
import type { SerializableImageGroup } from '../../../types/ImageGroup';

// ToDo: infer from store somehow...?
export interface State {
  images: Image[],
  imageGroups: SerializableImageGroup[],
}

export type TypedStore = MiddlewareAPI<Dispatch, State>;

interface ExportableReduxState extends Partial<State> {
  lastUpdateUTC?: number,
}

export type ExportableState = ExportableReduxState & Partial<Values>

export interface JSONExportState {
  state: ExportableState,
}

export interface JSONExportBinary {
  [k: string]: string,
}


export type JSONExport = JSONExportState & JSONExportBinary;
