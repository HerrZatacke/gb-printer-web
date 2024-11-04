/* eslint-disable default-param-last */
import updateIfDefined from '../../../tools/updateIfDefined';
import { Actions } from '../actions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import type { VideoParams } from '../../../../types/VideoParams';
import type { CancelAnimateImagesAction, SetVideoParamsAction } from '../../../../types/actions/VideoParamsOptions';

const videoParamsReducer = (
  value: VideoParams = {
    imageSelection: [],
  },
  action:
    SetVideoParamsAction |
    CancelAnimateImagesAction |
    GlobalUpdateAction,
): VideoParams => {
  switch (action.type) {
    case Actions.SET_VIDEO_PARAMS:
      return {
        ...value,
        ...action.payload,
      };
    case Actions.CANCEL_ANIMATE_IMAGES:
      return {
        ...value,
        imageSelection: [],
      };
    case Actions.GLOBAL_UPDATE:
      return updateIfDefined<VideoParams>(action.payload?.videoParams, value);
    default:
      return value;
  }
};

export default videoParamsReducer;
