import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import canShare from './reducers/canShareReducer';
import confirm from './reducers/confirmReducer';
import dragover from './reducers/dragoverReducer';
import dropboxStorage from './reducers/dropboxStorageReducer';
import editImage from './reducers/editImageReducer';
import editPalette from './reducers/editPaletteReducer';
import exportCropFrame from './reducers/exportCropFrameReducer';
import exportFileTypes from './reducers/exportFileTypesReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import filtersActiveTags from './reducers/filtersActiveTagsReducer';
import filtersVisible from './reducers/filtersVisibleReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import galleryView from './reducers/galleryViewReducer';
import gitStorage from './reducers/gitStorageReducer';
import hideDates from './reducers/hideDatesReducer';
import images from './reducers/imagesReducer';
import imageSelection from './reducers/imageSelectionReducer';
import importQueueSize from './reducers/importQueueSizeReducer';
import isFullscreen from './reducers/isFullscreenReducer';
import lastSelectedImage from './reducers/lastSelectedImageReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import lineBuffer from './reducers/lineBufferReducer';
import pageSize from './reducers/pageSizeReducer';
import palettes from './reducers/palettesReducer';
import printerBusy from './reducers/printerBusyReducer';
import printerData from './reducers/printerDataReducer';
import printerFunctions from './reducers/printerFunctionsReducer';
import printerUrl from './reducers/printerUrlReducer';
import progress from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import recentImports from './reducers/recentImportsReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import savFrameTypes from './reducers/savFrameTypesReducer';
import sortBy from './reducers/sortByReducer';
import sortOptionsVisible from './reducers/sortOptionsVisibleReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';
import syncBusy from './reducers/syncBusyReducer';
import syncSelect from './reducers/syncSelectReducer';
import videoParams from './reducers/videoParamsReducer';
import windowDimensions from './reducers/windowDimensionsReducer';

export default combineReducers({
  activePalette,
  canShare,
  confirm,
  dragover,
  dropboxStorage,
  editImage,
  editPalette,
  exportCropFrame,
  exportFileTypes,
  exportScaleFactors,
  filtersActiveTags,
  filtersVisible,
  frames,
  framesMessage,
  galleryView,
  gitStorage,
  hideDates,
  images,
  imageSelection,
  importQueueSize,
  isFullscreen,
  lastSelectedImage,
  progressLog,
  lightboxImage,
  lineBuffer,
  pageSize,
  palettes,
  printerBusy,
  printerData,
  printerFunctions,
  printerUrl,
  progress,
  recentImports,
  rgbnImages,
  savFrameTypes,
  sortBy,
  sortOptionsVisible,
  socketState,
  socketUrl,
  syncBusy,
  syncSelect,
  videoParams,
  windowDimensions,
});
