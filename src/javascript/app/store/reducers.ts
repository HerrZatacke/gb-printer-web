import type { Reducer, ReducersMapObject } from 'redux';
import { combineReducers } from 'redux';
import type { ExportFrameMode } from 'gb-image-decoder';
import type { Progress } from './reducers/progressReducer';
import type { TrashCount } from './reducers/trashCountReducer';
import type { WindowDimensions } from '../../../types/WindowDimensions';
import type { Dialog } from '../../../types/Dialog';
import type { DropBoxSettings, GitStorageSettings, RecentImport, SyncLastUpdate } from '../../../types/Sync';
import type { ErrorMessage } from '../components/Errors/useErrors';
import type { FrameGroup } from '../../../types/FrameGroup';
import type { Frame } from '../../../types/Frame';
import type { GalleryViews } from '../../consts/GalleryViews';
import type { CurrentEditBatch, Image, RGBNHashes } from '../../../types/Image';
import type { ImportItem } from '../../../types/ImportItem';
import type { Palette } from '../../../types/Palette';
import type { ProgressLog } from '../../../types/actions/LogActions';
import type { Plugin } from '../../../types/Plugin';
import type { VideoParams } from '../../../types/VideoParams';
import type { QueueImage } from '../../../types/QueueImage';
import type { PrinterInfo } from '../../../types/Printer';
import type { PrinterFunction } from '../../consts/printerFunction';
import type { PaletteSortMode } from '../../consts/paletteSortModes';
import activePalette from './reducers/activePaletteReducer';
import bitmapQueue from './reducers/bitmapQueueReducer';
import canShare from './reducers/canShareReducer';
import confirm from './reducers/confirmReducer';
import dragover from './reducers/dragoverReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import editRGBNImages from './reducers/editRGBNImagesReducer';
import enableDebug from './reducers/enableDebugReducer';
import errors from './reducers/errorsReducer';
import exportFileTypes from './reducers/exportFileTypesReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import filtersActiveTags from './reducers/filtersActiveTagsReducer';
import filtersVisible from './reducers/filtersVisibleReducer';
import forceMagicCheck from './reducers/forceMagicCheckReducer';
import frameGroupNames from './reducers/frameGroupNamesReducer';
import frameQueue from './reducers/frameQueueReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import galleryView from './reducers/galleryViewReducer';
import gitStorage from './reducers/gitStorageReducer';
import handleExportFrame from './reducers/handleExportFrameReducer';
import hideDates from './reducers/hideDatesReducer';
import images from './reducers/imagesReducer';
import importDeleted from './reducers/importDeletedReducer';
import importQueue from './reducers/importQueueReducer';
import imageSelection from './reducers/imageSelectionReducer';
import importLastSeen from './reducers/importLastSeenReducer';
import importPad from './reducers/importPadReducer';
import isFullscreen from './reducers/isFullscreenReducer';
import lastSelectedImage from './reducers/lastSelectedImageReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import pageSize from './reducers/pageSizeReducer';
import palettes from './reducers/palettesReducer';
import pickColors from './reducers/pickColorsReducer';
import plugins from './reducers/pluginsReducer';
import preferredLocale from './reducers/preferredLocaleReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import printerUrl from './reducers/printerUrlReducer';
import printerParams from './reducers/printerParamsReducer';
import progress from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import recentImports from './reducers/recentImportsReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import savFrameTypes from './reducers/savFrameTypesReducer';
import sortBy from './reducers/sortByReducer';
import sortPalettes from './reducers/sortPalettesReducer';
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
  editFrame: Reducer<string | null>,
  editPalette: Reducer<Palette | null>,
  editRGBNImages: Reducer<string[]>,
  enableDebug: Reducer<boolean>,
  errors: Reducer<ErrorMessage[]>,
  exportFileTypes: Reducer<string[]>,
  exportScaleFactors: Reducer<number[]>,
  filtersActiveTags: Reducer<string[]>,
  filtersVisible: Reducer<boolean>,
  forceMagicCheck: Reducer<boolean>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frameQueue: Reducer<ImportItem[]>,
  frames: Reducer<Frame[]>,
  framesMessage: Reducer<number>,
  galleryView: Reducer<GalleryViews>,
  gitStorage: Reducer<GitStorageSettings>,
  handleExportFrame: Reducer<ExportFrameMode>,
  hideDates: Reducer<boolean>,
  images: Reducer<Image[]>,
  imageSelection: Reducer<string[]>,
  importDeleted: Reducer<boolean>,
  importQueue: Reducer<ImportItem[]>,
  importLastSeen: Reducer<boolean>,
  importPad: Reducer<boolean>,
  isFullscreen: Reducer<boolean>,
  lastSelectedImage: Reducer<string | null>,
  progressLog: Reducer<ProgressLog>,
  lightboxImage: Reducer<number | null>,
  pageSize: Reducer<number>,
  palettes: Reducer<Palette[]>,
  plugins: Reducer<Plugin[]>,
  preferredLocale: Reducer<string>,
  printerBusy: Reducer<boolean>,
  printerData: Reducer<PrinterInfo>,
  printerFunctions: Reducer<PrinterFunction[]>,
  printerUrl: Reducer<string>,
  printerParams: Reducer<string>,
  progress: Reducer<Progress>,
  recentImports: Reducer<RecentImport[]>,
  rgbnImages: Reducer<RGBNHashes | null>,
  savFrameTypes: Reducer<string>,
  sortBy: Reducer<string>,
  sortPalettes: Reducer<PaletteSortMode>
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
  editFrame,
  editPalette,
  editRGBNImages,
  enableDebug,
  errors,
  exportFileTypes,
  exportScaleFactors,
  filtersActiveTags,
  filtersVisible,
  forceMagicCheck,
  frameGroupNames,
  frameQueue,
  frames,
  framesMessage,
  galleryView,
  gitStorage,
  handleExportFrame,
  hideDates,
  images,
  imageSelection,
  importDeleted,
  importQueue,
  importLastSeen,
  importPad,
  isFullscreen,
  lastSelectedImage,
  progressLog,
  lightboxImage,
  pageSize,
  palettes,
  pickColors,
  plugins,
  preferredLocale,
  printerBusy,
  printerData,
  printerFunctions,
  printerUrl,
  printerParams,
  progress,
  recentImports,
  rgbnImages,
  savFrameTypes,
  sortBy,
  sortPalettes,
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
