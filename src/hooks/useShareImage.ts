import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTracking } from '@/contexts/TrackingContext';
import { framesByIdsQueryOptions } from '@/stores/queries/frames';
import { imagesByHashesQueryOptions } from '@/stores/queries/images';
import { useSettingsStore } from '@/stores/stores';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { type PrepareFilesOptions, prepareFiles } from '@/tools/download';
import { loadImageTiles } from '@/tools/loadImageTiles';
import { Date } from '@/tools/safeDate';

interface UseShareImage {
  shareImage: (hash: string) => Promise<void>;
}

const useShareImage = (): UseShareImage => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame, fileNameStyle } = useSettingsStore();
  const { sendEvent } = useTracking();
  const queryClient = useQueryClient();

  const shareImage = useCallback(async (hash: string) => {
    if (!window.navigator.share) { return; }

    const { items: [image] } = await queryClient.fetchQuery(imagesByHashesQueryOptions([hash]));
    if (!image) {
      throw new Error('image not found');
    }

    const { items: [frame] } = await queryClient.fetchQuery(framesByIdsQueryOptions(image.frame ? [image.frame] : []));

    const shareScaleFactor = [...exportScaleFactors].pop() || 4;
    const shareFileType = [...exportFileTypes].pop() || 'png';

    const prepareFilesOptions: PrepareFilesOptions = {
      exportFileTypes: [shareFileType],
      exportScaleFactors: [shareScaleFactor],
      fileNameStyle,
      handleExportFrame,
    };

    const tiles = await loadImageTiles()(image.hash);

    const frameData = frame ? await loadFrameData(frame?.hash) : null;

    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    const downloadInfo = await prepareFiles(image, tiles || [], imageStartLine, prepareFilesOptions);

    const { blob, filename, title } = downloadInfo[0];

    window.navigator.share({
      files: [new File([blob], filename, { type: 'image/png', lastModified: Date.now() })],
      title,
    })
      .catch(() => ('¯\\_(ツ)_/¯'));

    sendEvent('shareImages', { imageCount: 1 });
  }, [exportFileTypes, exportScaleFactors, fileNameStyle, queryClient, handleExportFrame, sendEvent]);

  return {
    shareImage,
  };
};

export default useShareImage;
