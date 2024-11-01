import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import { videoParamsWithDefaults } from '../../../store/middlewares/animate';
import type { State } from '../../../store/State';
import type { VideoParams } from '../../../../../types/VideoParams';
import type {
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
    videoParamsWithDefaults(state.videoParams)
  ));
  const dispatch = useDispatch();

  const imageCount = videoParams.imageSelection?.length || 0;

  return {
    imageCount,
    videoParams,
    update: (params: Partial<VideoParams>) => {
      dispatch<SetVideoParamsAction>({
        type: Actions.SET_VIDEO_PARAMS,
        payload: params,
      });
    },
    cancel: () => {
      dispatch<CancelAnimateImagesAction>({
        type: Actions.CANCEL_ANIMATE_IMAGES,
      });
    },
    animate: () => {
      dispatch<AnimateImagesAction>({
        type: Actions.ANIMATE_IMAGES,
      });
    },
  };
};
