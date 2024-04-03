import { Actions } from '../../javascript/app/store/actions';
import { VideoParams } from '../VideoParams';

export interface SetVideoParamsAction {
  type: Actions.SET_VIDEO_PARAMS,
  payload: VideoParams
}

export interface AnimateImagesAction {
  type: Actions.ANIMATE_IMAGES,
}

export interface CancelAnimateImagesAction {
  type: Actions.CANCEL_ANIMATE_IMAGES,
}
