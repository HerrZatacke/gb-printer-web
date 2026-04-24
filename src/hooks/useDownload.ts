import { useCallback, useMemo } from 'react';
import { ExportTypes } from '@/consts/exportTypes';
import { useTracking } from '@/contexts/TrackingContext';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useInteractionsStore, useItemsStore, useSettingsStore } from '@/stores/stores';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { download, prepareFiles, PrepareFilesOptions } from '@/tools/download';
import generateFileName from '@/tools/generateFileName';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { loadImageTiles } from '@/tools/loadImageTiles';
import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';
import { TestFileType } from '@/tools/supportedCanvasImageFormats';
import { type DownloadBlob } from '@/types/download';
import { type DownloadInfo } from '@/types/Sync';

interface UseDownload {
  downloadImages: (hashes: string[]) => Promise<void>;
  prepareDownloadInfo: (hash: string, prepareFilesOptionsOverride?: PrepareFilesOptions) => Promise<DownloadInfo[]>;
  setDownloadImages: (hashes: string[]) => Promise<void>;
}

const useDownload = (): UseDownload => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame, fileNameStyle, alwaysShowDownloadDialog } = useSettingsStore();
  const { frames, palettes, images } = useItemsStore();
  const { setDownloadHashes } = useInteractionsStore();
  const { getSettingsFile } = useImportExportSettings();
  const { sendEvent } = useTracking();

  const prepareFilesOptions = useMemo<PrepareFilesOptions>(() => ( {
    exportFileTypes,
    exportScaleFactors,
    fileNameStyle,
    handleExportFrame,
    palettes,
  }), [exportFileTypes, exportScaleFactors, fileNameStyle, handleExportFrame, palettes]);

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

  const prepareDownloadInfo = useCallback(async (imageHash: string, prepareFilesOptionsOverride?: PrepareFilesOptions): Promise<DownloadInfo[]> => {
    const image = images.find(({ hash }) => hash === imageHash);
    if (!image) { throw new Error('image not found'); }

    const frame = frames.find(({ id }) => id === image.frame);
    const tiles = await loadImageTiles(images, frames)(image.hash);
    if (!tiles) { throw new Error('no tiles'); }

    const frameData = frame ? await loadFrameData(frame?.hash) : null;
    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    const options: PrepareFilesOptions = structuredClone(prepareFilesOptionsOverride || prepareFilesOptions);

    options.exportFileTypes = options.exportFileTypes.filter((fileType) => fileType !== TestFileType.JSON);

    if (!options.exportFileTypes.length) {
      return [];
    }

    return prepareFiles(image, tiles, imageStartLine, options);
  }, [frames, images, prepareFilesOptions]);

  const downloadImages = useCallback(async (hashes: string[]): Promise<void> => {
    const zipFilename = getZipFileName(hashes);
    const downloadInfos = (await Promise.all(hashes.map((hash) => prepareDownloadInfo(hash)))).flat();
    const resultFiles = downloadInfos.map(({ blob, filename }): DownloadBlob => ({ blob, filename }));

    if (prepareFilesOptions.exportFileTypes.includes(TestFileType.JSON)) {
      const settingsFile = await getSettingsFile(ExportTypes.SELECTED_IMAGES);

      resultFiles.push({
        blob: settingsFile,
        filename: settingsFile.name,
      });
    }

    if (!resultFiles.length) {
      return;
    }

    download(zipFilename)(resultFiles);
    sendEvent('downloadImages', { imageCount: nextPowerOfTwo(resultFiles.length) });
  }, [getSettingsFile, getZipFileName, prepareDownloadInfo, prepareFilesOptions.exportFileTypes, sendEvent]);

  const setDownloadImages = useCallback(async (hashes: string[]) => {
    if (alwaysShowDownloadDialog) {
      setDownloadHashes(hashes);
    } else {
      await downloadImages(hashes);
    }
  }, [alwaysShowDownloadDialog, downloadImages, setDownloadHashes]);

  return {
    downloadImages,
    prepareDownloadInfo,
    setDownloadImages,
  };
};

export default useDownload;
