import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import { createAnimation, videoParamsWithDefaults } from '../../../../tools/createAnimation';
import type { State } from '../../../store/State';
import type { VideoParams } from '../../../../../types/VideoParams';
import type {
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
  const state = useSelector((s: State) => s);
  const videoParams = videoParamsWithDefaults(state.videoParams);

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
      createAnimation(state);
      // Dispatch cancel clears images selected and hides the dialog
      // ToDo: make videoForm not need this.
      dispatch<CancelAnimateImagesAction>({
        type: Actions.CANCEL_ANIMATE_IMAGES,
      });
    },
  };
};
