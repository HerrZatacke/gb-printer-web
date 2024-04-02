/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';


const rgbnImagesReducer = (value = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_RGBN_PART: {
      const newVal = { ...value, ...action.payload };
      return newVal.r || newVal.g || newVal.b || newVal.n ? newVal : null;
    }

    case Actions.ADD_IMAGES:
      return action.payload[0]?.hashes ? null : value;
    case Actions.DELETE_IMAGE:
    case Actions.DELETE_IMAGES:
      return null;
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.rgbnImages, value);
    default:
      return value;
  }
};

export default rgbnImagesReducer;
