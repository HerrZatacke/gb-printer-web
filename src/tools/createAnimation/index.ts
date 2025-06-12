import chunk from 'chunk';
import { saveAs } from 'file-saver';
import type { RGBNTiles, RGBNPalette } from 'gb-image-decoder';
import { getRGBNImageBlob, getMonochromeImageBlob, ExportFrameMode, BW_PALETTE_HEX } from 'gb-image-decoder';
import { GifWriter } from 'omggif';
import Queue from 'promise-queue';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import { delay } from '@/tools/delay';
import generateFileName from '@/tools/generateFileName';
import { getImagePalettes } from '@/tools/getImagePalettes';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { loadImageTiles } from '@/tools/loadImageTiles';
import { reduceItems } from '@/tools/reduceArray';
import type { Image, MonochromeImage, RGBNImage } from '@/types/Image';
import type { Palette } from '@/types/Palette';
import type { VideoParams } from '@/types/VideoParams';
import { loadFrameData } from '../applyFrame/frameData';
import { getMonochromeImageCreationParams } from '../getMonochromeImageCreationParams';
import { getPaletteSettings } from '../getPaletteSettings';
import unique from '../unique';

interface GifFrameData {
  palette: number[],
  pixels: number[],
}

interface GetAddImagesParams {
  gifWriter: GifWriter,
  queue: Queue,
  frameRate: number,
  total: number,
  setProgress: (value: number) => void,
}

const getAddImages = ({
  gifWriter,
  queue,
  frameRate,
  total,
  setProgress,
}: GetAddImagesParams) => (canvas: HTMLCanvasElement, index: number) => (
  queue.add(() => new Promise((resolve, reject) => {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('missing context');
    }

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

    const {
      palette,
      pixels,
    } = chunk(data, 4).reduce((acc: GifFrameData, [r, g, b]): GifFrameData => {
      // eslint-disable-next-line no-bitwise
      const color: number = (r << 16) + (g << 8) + b;
      let colorIndex: number = acc.palette.findIndex((c) => c === color);
      if (colorIndex === -1) {
        colorIndex = acc.palette.length;
        acc.palette.push(color);
      }

      acc.pixels.push(colorIndex);

      return acc;
    }, { pixels: [], palette: [] });

    // Fix for RGB Images
    while (palette.length < 256) {
      palette.push(0);
    }

    try {
      setProgress((index + 1) / total);

      window.requestAnimationFrame(() => {
        gifWriter.addFrame(0, 0, canvas.width, canvas.height, pixels, {
          delay: Math.round(100 / frameRate),
          palette,
        });

        resolve(null);
      });
    } catch (error) {
      reject(error);
    }
  }))
);

export const videoParamsWithDefaults = (params: VideoParams): Required<VideoParams> => ({
  scaleFactor: params.scaleFactor || 4,
  frameRate: params.frameRate || 12,
  yoyo: params.yoyo || false,
  reverse: params.reverse || false,
  frame: params.frame || '',
  lockFrame: params.lockFrame || false,
  invertPalette: params.invertPalette || false,
  palette: params.palette || '',
  exportFrameMode: params.exportFrameMode || ExportFrameMode.FRAMEMODE_KEEP,
});

// ToDo: move to src/javascript/app/components/Overlays/VideoParamsForm/useVideoForm.ts
export const createAnimation = async () => {
  const { startProgress, setProgress, stopProgress, setError, videoSelection } = useInteractionsStore.getState();
  const { frames, palettes, images: stateImages } = useItemsStore.getState();
  const { videoParams, fileNameStyle } = useSettingsStore.getState();

  const progressId = startProgress('Creating Animation');
  // allow progress modal to appear safely
  await delay(10);

  const {
    scaleFactor,
    frameRate,
    yoyo,
    reverse,
    frame: videoFrame,
    lockFrame: videoLockFrame,
    invertPalette: videoInvertPalette,
    palette: videoPalette,
    exportFrameMode: handleExportFrame,
  } = videoParamsWithDefaults(videoParams);

  if (!videoSelection.length) {
    return;
  }

  const images: Image[] = videoSelection
    .map((imageHash) => (
      stateImages.find(({ hash }) => hash === imageHash)
    ))
    .reduce(reduceItems<Image>, []);


  const animationFrames = images.reduce((acc: Image[], image?: Image): Image[] => {
    if (!image) {
      return acc;
    }

    const animationFrame: Image = isRGBNImage(image) ? ({
      ...image,
      frame: videoFrame || image.frame,
    } as RGBNImage) : ({
      ...image,
      palette: videoPalette || image.palette,
    } as MonochromeImage);

    return [...acc, animationFrame];
  }, []);


  const tileLoader = loadImageTiles(images, frames);

  const canvases = await (Promise.all(animationFrames.map(async (image: Image): Promise<HTMLCanvasElement> => {
    const tiles = await tileLoader(image.hash);
    const lockFrame = videoLockFrame || image.lockFrame || false;
    const rotation = image.rotation || 0;

    const { palette, framePalette } = getImagePalettes(palettes, { ...image, lockFrame }); // set Lockframe to value set by global animate settings

    const frame = frames.find(({ id }) => id === image.frame);
    const frameData = frame ? await loadFrameData(frame.hash) : null;
    const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

    if (!tiles || !palette) {
      throw new Error('missing tiles or palette');
    }

    const isRGBN = isRGBNImage(image);
    let blob: Blob;

    if (isRGBN) {
      blob = await getRGBNImageBlob({
        tiles: tiles as RGBNTiles,
        palette: palette as RGBNPalette,
        lockFrame,
        imageStartLine,
        rotation,
        scaleFactor,
        handleExportFrame,
      }, 'image/png');
    } else {
      const pal = (palette as Palette)?.palette || BW_PALETTE_HEX;
      const framePal = (framePalette as Palette)?.palette || BW_PALETTE_HEX;

      const { invertPalette, invertFramePalette } = getPaletteSettings(image as MonochromeImage);

      const updateParams = getMonochromeImageCreationParams({
        imagePalette: pal,
        invertPalette: videoInvertPalette || invertPalette,
        framePalette: lockFrame ? framePal : pal,
        invertFramePalette: videoInvertPalette || invertFramePalette,
      });

      blob = await getMonochromeImageBlob({
        tiles: tiles as string[],
        imageStartLine,
        rotation,
        scaleFactor,
        handleExportFrame,
        ...updateParams,
      }, 'image/png');
    }

    const imageBitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(imageBitmap, 0, 0);

    return canvas;
  })));

  if (unique(
    canvases.map((canvas) => (`${canvas.width}*${canvas.height}`)),
  ).length !== 1) {
    stopProgress(progressId);
    setError(new Error('All images need to have same dimensions'));
    return;
  }

  const buf: number[] = [];
  const queue: Queue = new Queue(1, Infinity);
  const gifWriter: GifWriter = new GifWriter(buf, canvases[0].width, canvases[0].height, {
    loop: 0xffff,
  });


  if (yoyo) {
    const reverseImages = [...canvases].reverse();

    // remove first and last image, as they would
    // appear dupliicated in the animation
    reverseImages.shift();
    reverseImages.pop();

    canvases.push(...reverseImages);
  }

  if (reverse) {
    canvases.reverse();
  }

  const addImages = getAddImages({
    frameRate,
    gifWriter,
    queue,
    total: canvases.length,
    setProgress: (value: number) => {
      console.log(value);
      setProgress(progressId, value);
    },
  });

  await Promise.all(canvases.map(addImages));

  const gifFileName = generateFileName({
    useCurrentDate: true,
    exportScaleFactor: scaleFactor,
    frameRate,
    altTitle: 'animated',
    frameName: videoFrame,
    paletteShort: videoPalette,
    fileNameStyle,
  });

  const bufferSize = gifWriter.end();

  let file;
  try {
    file = new File(
      [new Uint8Array(buf.slice(0, bufferSize)).buffer],
      `${gifFileName}.gif`,
      { type: 'image/gif' },
    );
  } catch {
    file = new Blob(
      [new Uint8Array(buf.slice(0, bufferSize)).buffer],
    );
  }

  saveAs(file, `${gifFileName}.gif`);

  stopProgress(progressId);
};
