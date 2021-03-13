import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import canShare from './reducers/canShareReducer';
import confirmation from './reducers/confirmationReducer';
import dragover from './reducers/dragoverReducer';
import dropboxTokens from './reducers/dropboxTokensReducer';
import editImage from './reducers/editImageReducer';
import editPalette from './reducers/editPaletteReducer';
import exportCropFrame from './reducers/exportCropFrameReducer';
import exportFileTypes from './reducers/exportFileTypesReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import filter from './reducers/filtersReducer';
import frames from './reducers/framesReducer';
import framesMessage from './reducers/framesMessageReducer';
import galleryView from './reducers/galleryViewReducer';
import gitBusy from './reducers/gitBusyReducer';
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
import printerData from './reducers/printerDataReducer';
import printerUrl from './reducers/printerUrlReducer';
import progress from './reducers/progressReducer';
import progressLog from './reducers/progressLogReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import savFrameTypes from './reducers/savFrameTypesReducer';
import sortBy from './reducers/sortByReducer';
import sortOptionsVisible from './reducers/sortOptionsVisibleReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';
import videoParams from './reducers/videoParamsReducer';
import windowDimensions from './reducers/windowDimensionsReducer';

export default combineReducers({
  activePalette,
  canShare,
  confirmation,
  dragover,
  dropboxTokens,
  editImage,
  editPalette,
  exportCropFrame,
  exportFileTypes,
  exportScaleFactors,
  filter,
  frames,
  framesMessage,
  galleryView,
  gitBusy,
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
  printerData,
  printerUrl,
  progress,
  rgbnImages,
  savFrameTypes,
  sortBy,
  sortOptionsVisible,
  socketState,
  socketUrl,
  videoParams,
  windowDimensions,
});
