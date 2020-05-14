import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import confirmation from './reducers/confirmationReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import editImage from './reducers/editImageReducer';
import images from './reducers/imagesReducer';
import lineBuffer from './reducers/lineBufferReducer';
import palettes from './reducers/palettesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  activePalette,
  confirmation,
  exportScaleFactors,
  editImage,
  images,
  lineBuffer,
  palettes,
  socketState,
  socketUrl,
});
