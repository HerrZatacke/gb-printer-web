/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';

const frameGroupNamesReducer = (frameGroupNames = [], action) => {
  switch (action.type) {
    case Actions.NAME_FRAMEGROUP:
      return uniqueBy('id')([
        action.payload,
        ...frameGroupNames,
      ]);
    case Actions.GLOBAL_UPDATE:
      return uniqueBy('id')([
        ...action.payload.frameGroupNames,
        ...frameGroupNames,
      ]);
    default:
      return frameGroupNames;
  }
};

export default frameGroupNamesReducer;
