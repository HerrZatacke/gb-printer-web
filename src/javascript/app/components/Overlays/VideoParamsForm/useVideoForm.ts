import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import { videoParamsWithDefaults } from '../../../store/middlewares/animate';
import { State } from '../../../store/State';
import { VideoParams } from '../../../../../types/VideoParams';
import {
  AnimateImagesAction,
  CancelAnimateImagesAction,
  SetVideoParamsAction,
} from '../../../../../types/actions/VideoParamsOptions';

interface UseVideoForm {
  imageCount: number,
  videoParams: VideoParams,
  update: (params: Partial<VideoParams>) => void,
  cancel: () => void,
  animate: () => void,
}

export const useVideoForm = (): UseVideoForm => {
  const videoParams = useSelector((state: State): VideoParams => (
    videoParamsWithDefaults(state.videoParams, state.exportScaleFactors)
  ));
  const dispatch = useDispatch();

  const imageCount = videoParams.imageSelection?.length || 0;

  return {
    imageCount,
    videoParams,
    update: (params: Partial<VideoParams>) => {
      dispatch({
        type: Actions.SET_VIDEO_PARAMS,
        payload: params,
      } as SetVideoParamsAction);
    },
    cancel: () => {
      dispatch({
        type: Actions.CANCEL_ANIMATE_IMAGES,
      } as CancelAnimateImagesAction);
    },
    animate: () => {
      dispatch({
        type: Actions.ANIMATE_IMAGES,
      } as AnimateImagesAction);
    },
  };
};