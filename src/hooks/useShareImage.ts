import { useCallback } from 'react';
import useTracking from '@/contexts/TrackingContext';
import { useItemsStore, useSettingsStore } from '@/stores/stores';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { getPrepareFiles } from '@/tools/download';
import { loadImageTiles } from '@/tools/loadImageTiles';

interface UseShareImage {
  shareImage: (hash: string) => Promise<void>,
}

const useShareImage = (): UseShareImage => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame, fileNameStyle } = useSettingsStore();
  const { frames, palettes, images } = useItemsStore();
  const { sendEvent } = useTracking();

  const shareImage = useCallback(async (hash: string) => {
    if (!window.navigator.share) { return; }

    const image = images.find(({ hash: findHash }) => hash === findHash);
    if (!image) {
      throw new Error('image not found');
    }

    const frame = frames.find(({ id }) => id === image.frame);

    const shareScaleFactor = [...exportScaleFactors].pop() || 4;
    const shareFileType = [...exportFileTypes].pop() || 'png';

    const prepareFiles = getPrepareFiles(
      [shareScaleFactor],
      [shareFileType],
      handleExportFrame,
      palettes,
      fileNameStyle,
    );

    const tiles = await loadImageTiles(images, frames)(image.hash);

    const frameData = frame ? await loadFrameData(frame?.hash) : null;

    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    const downloadInfo = await prepareFiles(image, tiles || [], imageStartLine);

    const { blob, filename, title } = downloadInfo[0];

    window.navigator.share({
      files: [new File([blob], filename, { type: 'image/png', lastModified: Date.now() })],
      title,
    })
      .catch(() => ('¯\\_(ツ)_/¯'));

    sendEvent('shareImages', { imageCount: 1 });
  }, [exportFileTypes, exportScaleFactors, fileNameStyle, frames, handleExportFrame, images, palettes, sendEvent]);

  return {
    shareImage,
  };
};

export default useShareImage;
