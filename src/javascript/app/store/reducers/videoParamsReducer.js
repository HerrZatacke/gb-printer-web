import updateIfDefined from '../../../tools/updateIfDefined';
import {
  ANIMATE_IMAGES,
  CANCEL_ANIMATE_IMAGES,
  GLOBAL_UPDATE,
  SET_VIDEO_PARAMS,
} from '../actions';

const defaults = {
  imageSelection: [],
};

const videoParamsReducer = (value = defaults, action) => {
  switch (action.type) {
    case SET_VIDEO_PARAMS:
      return {
        ...value,
        ...action.payload,
      };
    case ANIMATE_IMAGES:
    case CANCEL_ANIMATE_IMAGES:
      return {
        ...value,
        imageSelection: [],
      };
    case GLOBAL_UPDATE:
      return updateIfDefined(action.payload.videoParams, value);
    default:
      return value;
  }
};

export default videoParamsReducer;
