import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import confirmation from './reducers/confirmationReducer';
import exportScaleFactors from './reducers/exportScaleFactorsReducer';
import images from './reducers/imagesReducer';
import lineBuffer from './reducers/lineBufferReducer';
import palettes from './reducers/palettesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  activePalette,
  confirmation,
  exportScaleFactors,
  images,
  lineBuffer,
  palettes,
  socketState,
  socketUrl,
});
