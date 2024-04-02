/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';


const defaults = {
  imageSelection: [],
};

const videoParamsReducer = (value = defaults, action) => {
  switch (action.type) {
    case Actions.SET_VIDEO_PARAMS:
      return {
        ...value,
        ...action.payload,
      };
    case Actions.ANIMATE_IMAGES:
    case Actions.CANCEL_ANIMATE_IMAGES:
      return {
        ...value,
        imageSelection: [],
      };
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined(action.payload.videoParams, value);
    default:
      return value;
  }
};

export default videoParamsReducer;
