/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';


const savFrameTypesReducer = (value = 'int', action) => {
  switch (action.type) {
    case Actions.SET_SAV_FRAME_TYPES:
      return action.payload;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.savFrameTypes, value);
    default:
      return value;
  }
};

export default savFrameTypesReducer;
