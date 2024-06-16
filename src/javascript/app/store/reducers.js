import { combineReducers } from 'redux';
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

export default combineReducers({
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
});
