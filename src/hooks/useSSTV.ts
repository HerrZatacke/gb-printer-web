import { saveAs } from 'file-saver';
import { ExportFrameMode } from 'gb-image-decoder';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PNG } from 'pngjs/browser';
import { useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SSTVEncoder, spec, writeWav } from 'sstv';
import { FileNameStyle } from '@/consts/fileNameStyles';
import useTracking from '@/contexts/TrackingContext';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { getPrepareFiles } from '@/tools/download';
import { loadImageTiles } from '@/tools/loadImageTiles';


interface UseSSTV {
  playImage: (hash: string) => Promise<void>,
}

const useSSTV = (): UseSSTV => {
  const { handleExportFrame } = useSettingsStore();
  const { frames, palettes, images } = useItemsStore();
  const { sendEvent } = useTracking();

  const playImage = useCallback(async (hash: string) => {
    const image = images.find(({ hash: findHash }) => hash === findHash);
    if (!image) {
      throw new Error('image not found');
    }

    const frame = frames.find(({ id }) => id === image.frame);

    const scaleFactor = 1;
    const imageType = 'png';
    // ensure 160x144 px resolution
    const exportFrameMode = ExportFrameMode.FRAMEMODE_KEEP;

    const prepareFiles = getPrepareFiles(
      [scaleFactor],
      [imageType],
      exportFrameMode,
      palettes,
      FileNameStyle.TITLE_ONLY,
    );

    const tiles = await loadImageTiles(images, frames)(image.hash);

    const frameData = frame ? await loadFrameData(frame?.hash) : null;

    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    const downloadInfo = await prepareFiles(image, tiles || [], imageStartLine);

    const { blob } = downloadInfo[0];

    const buffer = Buffer.from(await blob.arrayBuffer());


    const png = (new PNG()).parse(buffer);

    console.log(png);

    const encoder = new SSTVEncoder();
    const samples = encoder.encode(png, spec.M1);

    console.log(samples);

    // saveAs(blob, 'test.png');

    // new File([blob], filename, { type: 'image/png', lastModified: Date.now() })

    sendEvent('sstvImages', { imageCount: 1 });
  }, [frames, images, palettes, sendEvent]);

  return {
    playImage,
  };
};

export default useSSTV;
