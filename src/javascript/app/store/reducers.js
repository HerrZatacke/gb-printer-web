import { combineReducers } from 'redux';
import lineBuffer from './reducers/lineBufferReducer';
import socketState from './reducers/socketStateReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  lineBuffer,
  socketState,
  socketUrl,
});
