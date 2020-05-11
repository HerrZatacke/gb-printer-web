import { combineReducers } from 'redux';
import activePalette from './reducers/activePaletteReducer';
import lineBuffer from './reducers/lineBufferReducer';
import palettes from './reducers/palettesReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  activePalette,
  lineBuffer,
  palettes,
  socketState,
  socketUrl,
});
