import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { Progress } from './reducers/progressReducer';
import type { TrashCount } from './reducers/trashCountReducer';
import type { WindowDimensions } from '../../../types/WindowDimensions';
import type { Dialog } from '../../../types/Dialog';
import type { DropBoxSettings, GitStorageSettings, RecentImport, SyncLastUpdate } from '../../../types/Sync';
import type { EditGroupInfo } from '../../../types/actions/GroupActions';
import type { ErrorMessage } from '../components/Errors/useErrors';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { GalleryViews } from '../../consts/GalleryViews';
import type { CurrentEditBatch, Image } from '../../../types/Image';
import type { ImportItem } from '../../../types/ImportItem';
import type { Palette } from '../../../types/Palette';
import type { ProgressLog } from '../../../types/actions/LogActions';
import type { Plugin } from '../../../types/Plugin';
import type { VideoParams } from '../../../types/VideoParams';
import type { QueueImage } from '../../../types/QueueImage';
import type { PrinterInfo } from '../../../types/Printer';
import type { PrinterFunction } from '../../consts/printerFunction';
import type { SerializableImageGroup } from '../../../types/ImageGroup';
import activePalette from './reducers/activePaletteReducer';
import bitmapQueue from './reducers/bitmapQueueReducer';
import canShare from './reducers/canShareReducer';
import confirm from './reducers/confirmReducer';
import dragover from './reducers/dragoverReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editImageGroup from './reducers/editImageGroupReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import enableImageGroups from './reducers/enableImageGroupsReducer';
import errors from './reducers/errorsReducer';
import filtersActiveTags from './reducers/filtersActiveTagsReducer';
import filtersVisible from './reducers/filtersVisibleReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frameQueue from './reducers/frameQueueReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import galleryView from './reducers/galleryViewReducer';
import gitStorage from './reducers/gitStorageReducer';
import images from './reducers/imagesReducer';
import imageGroups from './reducers/imageGroupsReducer';
import importQueue from './reducers/importQueueReducer';
import imageSelection from './reducers/imageSelectionReducer';
import lastSelectedImage from './reducers/lastSelectedImageReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import progress from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import recentImports from './reducers/recentImportsReducer';
import sortBy from './reducers/sortByReducer';
import sortOptionsVisible from './reducers/sortOptionsVisibleReducer';
import syncBusy from './reducers/syncBusyReducer';
import syncLastUpdate from './reducers/syncLastUpdateReducer';
import syncSelect from './reducers/syncSelectReducer';
import useSerials from './reducers/useSerialsReducer';
import showSerials from './reducers/showSerialsReducer';
import trashCount from './reducers/trashCountReducer';
import videoParams from './reducers/videoParamsReducer';
import windowDimensions from './reducers/windowDimensionsReducer';

export interface Reducers extends ReducersMapObject {
  activePalette: Reducer<string | undefined>,
  bitmapQueue: Reducer<QueueImage[]>,
  canShare: Reducer<boolean>,
  confirm: Reducer<Dialog[]>,
  dragover: Reducer<boolean>,
  dropboxStorage: Reducer<DropBoxSettings>,
  editImage: Reducer<CurrentEditBatch | null>,
  editImageGroup: Reducer<EditGroupInfo | null>,
  editFrame: Reducer<string | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  enableImageGroups: Reducer<boolean>,
  errors: Reducer<ErrorMessage[]>,
  filtersActiveTags: Reducer<string[]>,
  filtersVisible: Reducer<boolean>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frameQueue: Reducer<ImportItem[]>,
  frames: Reducer<Frame[]>,
  framesMessage: Reducer<number>,
  galleryView: Reducer<GalleryViews>,
  gitStorage: Reducer<GitStorageSettings>,
  images: Reducer<Image[]>,
  imageGroups: Reducer<SerializableImageGroup>,
  imageSelection: Reducer<string[]>,
  importQueue: Reducer<ImportItem[]>,
  lastSelectedImage: Reducer<string | null>,
  progressLog: Reducer<ProgressLog>,
  lightboxImage: Reducer<string | null>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
  printerBusy: Reducer<boolean>,
  printerData: Reducer<PrinterInfo>,
  printerFunctions: Reducer<PrinterFunction[]>,
  progress: Reducer<Progress>,
  recentImports: Reducer<RecentImport[]>,
  sortBy: Reducer<string>,
  sortOptionsVisible: Reducer<boolean>,
  syncBusy: Reducer<boolean>,
  syncLastUpdate: Reducer<SyncLastUpdate>,
  syncSelect: Reducer<boolean>,
  useSerials: Reducer<boolean>,
  showSerials: Reducer<boolean>,
  trashCount: Reducer<TrashCount>,
  videoParams: Reducer<VideoParams>,
  windowDimensions: Reducer<WindowDimensions>,
}

const reducers: ReducersMapObject = {
  activePalette,
  bitmapQueue,
  canShare,
  confirm,
  dragover,
  dropboxStorage,
  editImage,
  editImageGroup,
  editFrame,
  editPalette,
  editRGBNImages,
  enableImageGroups,
  errors,
  filtersActiveTags,
  filtersVisible,
  frameGroupNames,
  frameQueue,
  frames,
  framesMessage,
  galleryView,
  gitStorage,
  images,
  imageGroups,
  imageSelection,
  importQueue,
  lastSelectedImage,
  progressLog,
  lightboxImage,
  palettes,
  pickColors,
  plugins,
  printerBusy,
  printerData,
  printerFunctions,
  progress,
  recentImports,
  sortBy,
  sortOptionsVisible,
  syncBusy,
  syncLastUpdate,
  syncSelect,
  useSerials,
  showSerials,
  trashCount,
  videoParams,
  windowDimensions,
};

export default combineReducers(reducers);
