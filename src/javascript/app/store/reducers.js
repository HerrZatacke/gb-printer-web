import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import confirmation from './reducers/confirmationReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import editImage from './reducers/editImageReducer';
import galleryView from './reducers/galleryViewReducer';
import globalIndex from './reducers/globalIndexReducer';
import images from './reducers/imagesReducer';
import lineBuffer from './reducers/lineBufferReducer';
import palettes from './reducers/palettesReducer';
import rgbnImages from './reducers/rgbnImagesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  activePalette,
  confirmation,
  exportScaleFactors,
  editImage,
  galleryView,
  globalIndex,
  images,
  lineBuffer,
  palettes,
  rgbnImages,
  socketState,
  socketUrl,
});
