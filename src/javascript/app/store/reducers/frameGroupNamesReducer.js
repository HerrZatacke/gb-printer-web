import uniqueBy from '../../../tools/unique/by';
import { GLOBAL_UPDATE, NAME_FRAMEGROUP } from '../actions';

const frameGroupNamesReducer = (frameGroupNames = [], action) => {
  switch (action.type) {
    case NAME_FRAMEGROUP:
      return uniqueBy('id')([
        action.payload,
        ...frameGroupNames,
      ]);
    case GLOBAL_UPDATE:
      return uniqueBy('id')([
        ...action.payload.frameGroupNames,
        ...frameGroupNames,
      ]);
    default:
      return frameGroupNames;
  }
};

export default frameGroupNamesReducer;
