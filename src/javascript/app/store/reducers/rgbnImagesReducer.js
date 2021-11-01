import updateIfDefined from '../../../tools/updateIfDefined';
import {
  ADD_IMAGES,
  DELETE_IMAGE,
  DELETE_IMAGES,
  GLOBAL_UPDATE,
  UPDATE_RGBN_PART,
} from '../actions';

const rgbnImagesReducer = (value = null, action) => {
  switch (action.type) {
    case UPDATE_RGBN_PART: {
      const newVal = { ...value, ...action.payload };
      return newVal.r || newVal.g || newVal.b || newVal.n ? newVal : null;
    }

    case ADD_IMAGES:
      return action.payload[0]?.hashes ? null : value;
    case DELETE_IMAGE:
    case DELETE_IMAGES:
      return null;
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.rgbnImages, value);
    default:
      return value;
  }
};

export default rgbnImagesReducer;
