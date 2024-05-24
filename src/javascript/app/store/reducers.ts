import { combineReducers, Reducer, ReducersMapObject } from 'redux';
import { ExportFrameMode } from 'gb-image-decoder';
import activePalette from './reducers/activePaletteReducer';
import bitmapQueue from './reducers/bitmapQueueReducer';
import canShare from './reducers/canShareReducer';
import confirm from './reducers/confirmReducer';
import dragover from './reducers/dragoverReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editFrame from './reducers/editFrameReducer';
import editPalette from './reducers/editPaletteReducer';
import enableDebug from './reducers/enableDebugReducer';
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
import plugins from './reducers/pluginsReducer';
import preferredLocale from './reducers/preferredLocaleReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import printerUrl from './reducers/printerUrlReducer';
import printerParams from './reducers/printerParamsReducer';
import progress, { Progress } from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import recentImports, { RecentImport } from './reducers/recentImportsReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import savFrameTypes from './reducers/savFrameTypesReducer';
import sortBy from './reducers/sortByReducer';
import sortOptionsVisible from './reducers/sortOptionsVisibleReducer';
import syncBusy from './reducers/syncBusyReducer';
import syncLastUpdate from './reducers/syncLastUpdateReducer';
import syncSelect from './reducers/syncSelectReducer';
import useSerials from './reducers/useSerialsReducer';
import showSerials from './reducers/showSerialsReducer';
import trashCount, { TrashCount } from './reducers/trashCountReducer';
import videoParams from './reducers/videoParamsReducer';
import windowDimensions, { WindowDimensions } from './reducers/windowDimensionsReducer';
import { Dialog } from '../../../types/Dialog';
import { DropBoxSettings, GitStorageSettings, SyncLastUpdate } from '../../../types/actions/StorageActions';
import { FrameGroup } from '../../../types/FrameGroup';
import { Frame } from '../../../types/Frame';
import { GalleryViews } from '../../consts/GalleryViews';
import { CurrentEditBatch, Image, RGBNHashes } from '../../../types/Image';
import { ImportItem } from '../../../types/ImportItem';
import { Palette } from '../../../types/Palette';
import { ProgressLog } from '../../../types/actions/LogActions';
import { Plugin } from '../../../types/Plugin';
import { VideoParams } from '../../../types/VideoParams';
import { QueueImage } from '../../../types/QueueImage';
import { PrinterInfo } from '../../../types/Printer';

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
  enableDebug: Reducer<boolean>,
  exportFileTypes: Reducer<string[]>,
  exportScaleFactors: Reducer<number[]>,
  filtersActiveTags: Reducer<string[]>,
  filtersVisible: Reducer<boolean>,
  forceMagicCheck: Reducer<boolean>,
  frameGroupNames: Reducer<FrameGroup[]>,
  frameQueue: Reducer<Frame[]>,
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
  printerFunctions: Reducer<object[]>,
  printerUrl: Reducer<string>,
  printerParams: Reducer<string>,
  progress: Reducer<Progress>,
  recentImports: Reducer<RecentImport[]>,
  rgbnImages: Reducer<RGBNHashes | null>,
  savFrameTypes: Reducer<string>,
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
  editFrame,
  editPalette,
  enableDebug,
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
