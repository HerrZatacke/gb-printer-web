import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import confirmation from './reducers/confirmationReducer';
import dragover from './reducers/dragoverReducer';
import editImage from './reducers/editImageReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import galleryView from './reducers/galleryViewReducer';
import globalIndex from './reducers/globalIndexReducer';
import images from './reducers/imagesReducer';
import importQueueSize from './reducers/importQueueSizeReducer';
import lightboxImage from './reducers/lightboxImageReducer';
import lineBuffer from './reducers/lineBufferReducer';
import palettes from './reducers/palettesReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  activePalette,
  confirmation,
  dragover,
  editImage,
  exportScaleFactors,
  galleryView,
  globalIndex,
  images,
  importQueueSize,
  lightboxImage,
  lineBuffer,
  palettes,
  rgbnImages,
  socketState,
  socketUrl,
});
