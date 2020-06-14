import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import canShare from './reducers/canShareReducer';
import confirmation from './reducers/confirmationReducer';
import dragover from './reducers/dragoverReducer';
import editImage from './reducers/editImageReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import filter from './reducers/filtersReducer';
import galleryView from './reducers/galleryViewReducer';
import globalIndex from './reducers/globalIndexReducer';
import images from './reducers/imagesReducer';
import imageSelection from './reducers/imageSelectionReducer';
import importQueueSize from './reducers/importQueueSizeReducer';
import isFullscreen from './reducers/isFullscreenReducer';
import lastSelectedImage from './reducers/lastSelectedImageReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import lineBuffer from './reducers/lineBufferReducer';
import pageSize from './reducers/pageSizeReducer';
import palettes from './reducers/palettesReducer';
import printerData from './reducers/printerData';
import rgbnImages from './reducers/rgbnImagesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';
import windowDimensions from './reducers/windowDimensionsReducer';

export default combineReducers({
  activePalette,
  canShare,
  confirmation,
  dragover,
  editImage,
  exportScaleFactors,
  filter,
  galleryView,
  globalIndex,
  images,
  imageSelection,
  importQueueSize,
  isFullscreen,
  lastSelectedImage,
  lightboxImage,
  lineBuffer,
  pageSize,
  palettes,
  printerData,
  rgbnImages,
  socketState,
  socketUrl,
  windowDimensions,
});
