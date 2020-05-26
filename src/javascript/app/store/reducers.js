import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import confirmation from './reducers/confirmationReducer';
import currentPage from './reducers/currentPageReducer';
import dragover from './reducers/dragoverReducer';
import editImage from './reducers/editImageReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import galleryView from './reducers/galleryViewReducer';
import globalIndex from './reducers/globalIndexReducer';
import images from './reducers/imagesReducer';
import importQueueSize from './reducers/importQueueSizeReducer';
import isFullscreen from './reducers/isFullscreenReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import lineBuffer from './reducers/lineBufferReducer';
import pageSize from './reducers/pageSizeReducer';
import palettes from './reducers/palettesReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  activePalette,
  confirmation,
  currentPage,
  dragover,
  editImage,
  exportScaleFactors,
  galleryView,
  globalIndex,
  images,
  importQueueSize,
  isFullscreen,
  lightboxImage,
  lineBuffer,
  pageSize,
  palettes,
  rgbnImages,
  socketState,
  socketUrl,
});
