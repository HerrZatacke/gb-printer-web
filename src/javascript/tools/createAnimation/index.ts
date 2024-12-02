import Queue from 'promise-queue';
import type { RGBNTiles, RGBNPalette } from 'gb-image-decoder';
import { RGBNDecoder, Decoder, ExportFrameMode, BW_PALETTE_HEX } from 'gb-image-decoder';
import { GifWriter } from 'omggif';
import { saveAs } from 'file-saver';
import chunk from 'chunk';
import useItemsStore from '../../app/stores/itemsStore';
import useInteractionsStore from '../../app/stores/interactionsStore';
import useSettingsStore from '../../app/stores/settingsStore';
import { loadImageTiles } from '../loadImageTiles';
import { getImagePalettes } from '../getImagePalettes';
import generateFileName from '../generateFileName';
import { getRotatedCanvas } from '../applyRotation';
import { isRGBNImage } from '../isRGBNImage';
import { reduceItems } from '../reduceArray';
import type { Image, MonochromeImage, RGBNImage } from '../../../types/Image';
import type { VideoParams } from '../../../types/VideoParams';
import type { Palette } from '../../../types/Palette';
import unique from '../unique';
import { loadFrameData } from '../applyFrame/frameData';
import { getDecoderUpdateParams } from '../getDecoderUpdateParams';

interface GifFrameData {
  palette: number[],
  pixels: number[],
}

const getAddImages = (
  gifWriter: GifWriter,
  queue: Queue,
  frameRate: number,
  total: number,
) => (canvas: HTMLCanvasElement, index: number) => (
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
      useInteractionsStore.getState().setProgress('gif', (index + 1) / total);

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
  const { setProgress, setError, videoSelection } = useInteractionsStore.getState();
  const { frames, palettes, images: stateImages } = useItemsStore.getState();
  const { videoParams } = useSettingsStore.getState();

  setProgress('gif', 0.01);

  const {
    scaleFactor,
    frameRate,
    yoyo,
    reverse,
    frame: videoFrame,
    lockFrame: videoLockFrame,
    invertPalette: videoInvertPalette,
    palette: videoPalette,
    exportFrameMode,
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
    let decoder: RGBNDecoder | Decoder;

    if (isRGBN) {
      decoder = new RGBNDecoder();
      decoder.update({
        canvas: null,
        tiles: tiles as RGBNTiles,
        palette: palette as RGBNPalette,
        lockFrame,
      });
    } else {
      decoder = new Decoder();
      const pal = (palette as Palette)?.palette || BW_PALETTE_HEX;
      const framePal = (framePalette as Palette)?.palette || BW_PALETTE_HEX;
      const invertPalette = videoInvertPalette || (image as MonochromeImage).invertPalette || false;
      const invertFramePalette = videoInvertPalette || (image as MonochromeImage).invertFramePalette || false;

      const updateParams = getDecoderUpdateParams({
        palette: pal,
        invertPalette,
        framePalette: lockFrame ? framePal : pal,
        invertFramePalette: lockFrame ? invertFramePalette : invertPalette,
      });

      decoder.update({
        canvas: null,
        tiles: tiles as string[],
        ...updateParams,
        imageStartLine,
      });
    }

    return getRotatedCanvas(decoder.getScaledCanvas(scaleFactor || 1, exportFrameMode), rotation);
  })));

  if (unique(
    canvases.map((canvas) => (`${canvas.width}*${canvas.height}`)),
  ).length !== 1) {
    setProgress('gif', 0);
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

  const addImages = getAddImages(gifWriter, queue, frameRate, canvases.length);

  await Promise.all(canvases.map(addImages));

  const gifFileName = generateFileName({
    useCurrentDate: true,
    exportScaleFactor: scaleFactor,
    frameRate,
    altTitle: 'animated',
    frameName: videoFrame,
    paletteShort: videoPalette,
  });

  const bufferSize = gifWriter.end();

  let file;
  try {
    file = new File(
      [new Uint8Array(buf.slice(0, bufferSize)).buffer],
      `${gifFileName}.gif`,
      { type: 'image/gif' },
    );
  } catch (error) {
    file = new Blob(
      [new Uint8Array(buf.slice(0, bufferSize)).buffer],
    );
  }

  saveAs(file, `${gifFileName}.gif`);

  setProgress('gif', 0);
};
