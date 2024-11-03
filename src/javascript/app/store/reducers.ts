import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Progress } from './reducers/progressReducer';
import type { TrashCount } from './reducers/trashCountReducer';
import type { Dialog } from '../../../types/Dialog';
import type { DropBoxSettings, GitStorageSettings, SyncLastUpdate } from '../../../types/Sync';
import type { ErrorMessage } from '../components/Errors/useErrors';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { ImportItem } from '../../../types/ImportItem';
import type { Palette } from '../../../types/Palette';
import type { ProgressLog } from '../../../types/actions/LogActions';
import type { Plugin } from '../../../types/Plugin';
import type { VideoParams } from '../../../types/VideoParams';
import type { QueueImage } from '../../../types/QueueImage';
import type { PrinterInfo } from '../../../types/Printer';
import type { PrinterFunction } from '../../consts/printerFunction';
import bitmapQueue from './reducers/bitmapQueueReducer';
import confirm from './reducers/confirmReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import errors from './reducers/errorsReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frameQueue from './reducers/frameQueueReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import gitStorage from './reducers/gitStorageReducer';
import images from './reducers/imagesReducer';
import importQueue from './reducers/importQueueReducer';
import isFullscreen from './reducers/isFullscreenReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import progress from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import syncBusy from './reducers/syncBusyReducer';
import syncLastUpdate from './reducers/syncLastUpdateReducer';
import syncSelect from './reducers/syncSelectReducer';
import useSerials from './reducers/useSerialsReducer';
import showSerials from './reducers/showSerialsReducer';
import trashCount from './reducers/trashCountReducer';
import videoParams from './reducers/videoParamsReducer';

export interface Reducers extends ReducersMapObject {
  bitmapQueue: Reducer<QueueImage[]>,
  confirm: Reducer<Dialog[]>,
  dropboxStorage: Reducer<DropBoxSettings>,
  editImage: Reducer<CurrentEditBatch | null>,
  editFrame: Reducer<string | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  errors: Reducer<ErrorMessage[]>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frameQueue: Reducer<ImportItem[]>,
  frames: Reducer<Frame[]>,
  framesMessage: Reducer<number>,
  gitStorage: Reducer<GitStorageSettings>,
  images: Reducer<Image[]>,
  importQueue: Reducer<ImportItem[]>,
  isFullscreen: Reducer<boolean>,
  progressLog: Reducer<ProgressLog>,
  lightboxImage: Reducer<number | null>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
  printerBusy: Reducer<boolean>,
  printerData: Reducer<PrinterInfo>,
  printerFunctions: Reducer<PrinterFunction[]>,
  progress: Reducer<Progress>,
  syncBusy: Reducer<boolean>,
  syncLastUpdate: Reducer<SyncLastUpdate>,
  syncSelect: Reducer<boolean>,
  useSerials: Reducer<boolean>,
  showSerials: Reducer<boolean>,
  trashCount: Reducer<TrashCount>,
  videoParams: Reducer<VideoParams>,
}

const reducers: ReducersMapObject = {
  bitmapQueue,
  confirm,
  dropboxStorage,
  editImage,
  editFrame,
  editPalette,
  editRGBNImages,
  errors,
  frameGroupNames,
  frameQueue,
  frames,
  framesMessage,
  gitStorage,
  images,
  importQueue,
  isFullscreen,
  progressLog,
  lightboxImage,
  palettes,
  pickColors,
  plugins,
  printerBusy,
  printerData,
  printerFunctions,
  progress,
  syncBusy,
  syncLastUpdate,
  syncSelect,
  useSerials,
  showSerials,
  trashCount,
  videoParams,
};

export default combineReducers(reducers);
