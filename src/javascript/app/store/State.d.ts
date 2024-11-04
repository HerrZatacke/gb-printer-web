import type { Dispatch, MiddlewareAPI } from 'redux';
import type { QueueImage } from '../../../types/QueueImage';
import type { Dialog } from '../../../types/Dialog';
import type { DropBoxSettings, GitStorageSettings, SyncLastUpdate } from '../../../types/Sync';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { ImportItem } from '../../../types/ImportItem';
import type { Plugin } from '../../../types/Plugin';
import type { VideoParams } from '../../../types/VideoParams';
import type { PrinterInfo } from '../../../types/Printer';
import type { PrinterFunction } from '../../consts/printerFunction';
import type { PickColors } from '../../../types/PickColors';

// ToDo: infer from store somehow...?
export interface State {
  bitmapQueue: QueueImage[],
  confirm: Dialog[],
  dropboxStorage: DropBoxSettings,
  editImage: CurrentEditBatch | null,
  editFrame: string | null,
  editPalette: Palette | null,
  editRGBNImages: string[],
  frameGroupNames: FrameGroup[],
  frameQueue: ImportItem[],
  frames: Frame[],
  framesMessage: number,
  gitStorage: GitStorageSettings,
  images: Image[],
  importQueue: ImportItem[],
  palettes: Palette[],
  pickColors: PickColors | null,
  plugins: Plugin[],
  printerBusy: boolean,
  printerData: PrinterInfo,
  printerFunctions: PrinterFunction[],
  syncLastUpdate: SyncLastUpdate,
  useSerials: boolean,
  showSerials: boolean,
  videoParams: VideoParams,
}

export type TypedStore = MiddlewareAPI<Dispatch, State>;

// properties containing tokens/passwords etc must get removed before exporting
export interface NoExport {
  gitStorage?: undefined,
  dropboxStorage?: undefined,
  printerUrl?: undefined,
}

export interface ExportableState extends Omit<Partial<State>, keyof NoExport> {
  lastUpdateUTC?: number,
}

export interface JSONExportState {
  state: ExportableState,
}

export interface JSONExportBinary {
  [k: string]: string,
}


export type JSONExport = JSONExportState & JSONExportBinary;
