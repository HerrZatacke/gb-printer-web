import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import useItemsStore from '../app/stores/itemsStore';
import useSettingsStore from '../app/stores/settingsStore';
import { getPrepareFiles } from '../tools/download';
import download from '../tools/download/download';
import generateFileName from '../tools/generateFileName';
import { loadImageTiles } from '../tools/loadImageTiles';
import { getImagePalettes } from '../tools/getImagePalettes';
import { loadFrameData } from '../tools/applyFrame/frameData';
import type { State } from '../app/store/State';

interface UseDownload {
  downloadSingleImage: (hash: string) => Promise<void>
  downloadImageCollection: (hashes: string[]) => Promise<void>
}

const useDownload = (): UseDownload => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame } = useSettingsStore.getState();

  const images = useSelector((state: State) => state.images);

  const { frames, palettes } = useItemsStore.getState();

  const prepareFiles = getPrepareFiles(
    exportScaleFactors,
    exportFileTypes,
    handleExportFrame,
    palettes,
  );


  const downloadSingleImage = useCallback(async (imageHash: string): Promise<void> => {
    const image = images.find(({ hash }) => hash === imageHash);
    if (!image) {
      throw new Error('image not found');
    }

    const frame = frames.find(({ id }) => id === image.frame);

    const { palette: imagePalette } = getImagePalettes(palettes, image);
    if (!imagePalette) {
      throw new Error('imagePalette not found');
    }

    const zipFilename = generateFileName({
      image,
      palette: imagePalette,
    });

    const tiles = await loadImageTiles(images, frames)(image.hash);

    const frameData = frame ? await loadFrameData(frame?.hash) : null;

    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    if (!tiles) {
      throw new Error('no tiles');
    }

    const files = await prepareFiles(image)(tiles, imageStartLine);
    return download(zipFilename)(files);
  }, [frames, images, palettes, prepareFiles]);


  const downloadImageCollection = useCallback(async (hashes: string[]): Promise<void> => {
    const zipFilename = generateFileName({
      altTitle: 'gameboy-printer-gallery',
      useCurrentDate: true,
    });

    const resultImages = await Promise.all(hashes.map(async (imageHash) => {
      const image = images.find(({ hash }) => hash === imageHash);
      if (!image) {
        throw new Error('image not found');
      }

      const frame = frames.find(({ id }) => id === image.frame);

      const tiles = await loadImageTiles(images, frames)(image.hash);

      const frameData = frame ? await loadFrameData(frame?.hash) : null;

      const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

      return prepareFiles(image)(tiles || [], imageStartLine);
    }));

    download(zipFilename)(resultImages.flat());
  }, [frames, images, prepareFiles]);

  return {
    downloadSingleImage,
    downloadImageCollection,
  };
};

export default useDownload;
