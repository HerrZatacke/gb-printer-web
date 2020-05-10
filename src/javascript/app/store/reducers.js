import { combineReducers } from 'redux';
import lineBuffer from './reducers/lineBufferReducer';
import socketUrl from './reducers/socketUrlReducer';

export default combineReducers({
  lineBuffer,
  socketUrl,
});
