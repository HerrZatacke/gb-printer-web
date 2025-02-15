import { createAnimation, videoParamsWithDefaults } from '../../../../tools/createAnimation';
import type { VideoParams } from '../../../../../types/VideoParams';
import useSettingsStore from '../../../stores/settingsStore';
import useInteractionsStore from '../../../stores/interactionsStore';

interface UseVideoForm {
  imageCount: number,
  videoParams: VideoParams,
  update: (params: Partial<VideoParams>) => void,
  cancel: () => void,
  animate: () => void,
}

export const useVideoForm = (): UseVideoForm => {
  const { videoParams: stateVideoParams, setVideoParams } = useSettingsStore();
  const { videoSelection, setVideoSelection } = useInteractionsStore();
  const videoParams = videoParamsWithDefaults(stateVideoParams);
  const imageCount = videoSelection.length || 0;

  return {
    imageCount,
    videoParams,
    update: setVideoParams,
    cancel: () => {
      setVideoSelection([]); // Hide dialog
    },
    animate: () => {
      createAnimation();
      setVideoSelection([]); // Hide dialog
    },
  };
};
