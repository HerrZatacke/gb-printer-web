import { useCallback, useMemo } from 'react';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { getPrepareFiles, download } from '@/tools/download';
import generateFileName from '@/tools/generateFileName';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { loadImageTiles } from '@/tools/loadImageTiles';
import { DownloadInfo } from '@/types/Sync';

interface UseDownload {
  downloadImages: (hashes: string[]) => Promise<void>
  setDownloadImages: (hashes: string[]) => Promise<void>
}

const useDownload = (): UseDownload => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame, fileNameStyle, alwaysShowDownloadDialog } = useSettingsStore();
  const { frames, palettes, images } = useItemsStore();
  const { setDownloadHashes } = useInteractionsStore();

  const prepareFiles = useMemo(() => getPrepareFiles(
    exportScaleFactors,
    exportFileTypes,
    handleExportFrame,
    palettes,
    fileNameStyle,
  ), [exportFileTypes, exportScaleFactors, fileNameStyle, handleExportFrame, palettes]);

  const getZipFileName = useCallback((hashes: string[]): string => {
    if (hashes.length === 1) {
      const image = images.find(({ hash }) => hash === hashes[0]);
      if (!image) {
        throw new Error('image not found');
      }

      const { palette: imagePalette } = getImagePalettes(palettes, image);
      if (!imagePalette) {
        throw new Error('imagePalette not found');
      }

      return generateFileName({
        image,
        palette: imagePalette,
        fileNameStyle,
      });
    }

    return generateFileName({
      altTitle: 'gameboy-printer-gallery',
      useCurrentDate: true,
      fileNameStyle,
    });
  }, [fileNameStyle, images, palettes]);

  const prepareDownloadInfo = useCallback(async (imageHash: string): Promise<DownloadInfo[]> => {
    const image = images.find(({ hash }) => hash === imageHash);
    if (!image) { throw new Error('image not found'); }

    const frame = frames.find(({ id }) => id === image.frame);
    const tiles = await loadImageTiles(images, frames)(image.hash);
    if (!tiles) { throw new Error('no tiles'); }

    const frameData = frame ? await loadFrameData(frame?.hash) : null;
    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    return prepareFiles(image, tiles, imageStartLine);
  }, [frames, images, prepareFiles]);

  const downloadImages = useCallback(async (hashes: string[]): Promise<void> => {
    const zipFilename = getZipFileName(hashes);
    const resultImages = await Promise.all(hashes.map(prepareDownloadInfo));
    download(zipFilename)(resultImages.flat());
  }, [getZipFileName, prepareDownloadInfo]);

  const setDownloadImages = useCallback(async (hashes: string[]) => {
    if (alwaysShowDownloadDialog) {
      setDownloadHashes(hashes);
    } else {
      await downloadImages(hashes);
    }
  }, [alwaysShowDownloadDialog, downloadImages, setDownloadHashes]);

  return {
    downloadImages,
    setDownloadImages,
  };
};

export default useDownload;
