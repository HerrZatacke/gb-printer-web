import { useCallback } from 'react';
import { usePalettes } from '@/hooks/usePalettes';
import { useInteractionsStore, useItemsStore, useSettingsStore } from '@/stores/stores';
import { createAnimation, videoParamsWithDefaults } from '@/tools/createAnimation';
import { type VideoParams } from '@/types/VideoParams';

interface UseVideoForm {
  imageCount: number;
  videoParams: VideoParams;
  update: (params: Partial<VideoParams>) => void;
  cancel: () => void;
  animate: () => void;
}

export const useVideoForm = (): UseVideoForm => {
  const { videoParams: stateVideoParams, setVideoParams } = useSettingsStore();
  const { videoSelection, setVideoSelection } = useInteractionsStore();
  const videoParams = videoParamsWithDefaults(stateVideoParams);
  const imageCount = videoSelection.length || 0;

  const itemsState = useItemsStore();
  const { palettes } = usePalettes({ list: true });

  const animate = useCallback(() => {
    createAnimation(itemsState, palettes);
    setVideoSelection([]); // Hide dialog
  }, [itemsState, palettes, setVideoSelection]);

  return {
    imageCount,
    videoParams,
    update: setVideoParams,
    cancel: () => {
      setVideoSelection([]); // Hide dialog
    },
    animate,
  };
};
