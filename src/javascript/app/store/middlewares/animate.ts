import Queue from 'promise-queue';
import type { AnyAction, Dispatch } from 'redux';
import type { RGBNTiles, RGBNPalette } from 'gb-image-decoder';
import { RGBNDecoder, Decoder, ExportFrameMode } from 'gb-image-decoder';
import { GifWriter } from 'omggif';
import { saveAs } from 'file-saver';
import chunk from 'chunk';
import { loadImageTiles } from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import generateFileName from '../../../tools/generateFileName';
import { Actions } from '../actions';
import { getRotatedCanvas } from '../../../tools/applyRotation';
import { isRGBNImage } from '../../../tools/isRGBNImage';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { Image, MonochromeImage, RGBNImage } from '../../../../types/Image';
import type { VideoParams } from '../../../../types/VideoParams';
import type { Palette } from '../../../../types/Palette';
import type { State } from '../State';
import unique from '../../../tools/unique';
import type { ProgressCreateGifAction } from '../../../../types/actions/ProgressActions';
import type { ErrorAction } from '../../../../types/actions/GlobalActions';

interface GifFrameData {
  palette: number[],
  pixels: number[],
}

const getAddImages = (
  dispatch: Dispatch<AnyAction>,
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
      dispatch<ProgressCreateGifAction>({
        type: Actions.CREATE_GIF_PROGRESS,
        payload: (index + 1) / total,
      });

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

export const videoParamsWithDefaults = (params: VideoParams, scaleFactors: number[]): Required<VideoParams> => ({
  scaleFactor: params.scaleFactor || scaleFactors[scaleFactors.length - 1] || 4,
  frameRate: params.frameRate || 12,
  imageSelection: params.imageSelection || [],
  yoyo: params.yoyo || false,
  reverse: params.reverse || false,
  frame: params.frame || '',
  lockFrame: params.lockFrame || false,
  invertPalette: params.invertPalette || false,
  palette: params.palette || '',
  exportFrameMode: params.exportFrameMode || ExportFrameMode.FRAMEMODE_KEEP,
});

const createAnimation = async (state: State, dispatch: Dispatch<AnyAction>) => {
  const {
    scaleFactor,
    frameRate,
    imageSelection,
    yoyo,
    reverse,
    frame: videoFrame,
    lockFrame: videoLockFrame,
    invertPalette: videoInvertPalette,
    palette: videoPalette,
    exportFrameMode,
  } = videoParamsWithDefaults(state.videoParams, state.exportScaleFactors);

  if (!imageSelection.length) {
    return;
  }

  const images: (Image | undefined)[] = await Promise.all(imageSelection.map((imageHash) => (
    state.images.find(({ hash }) => hash === imageHash)
  )));


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


  const tileLoader = loadImageTiles(state);

  const canvases = await (Promise.all(animationFrames.map(async (image: Image): Promise<HTMLCanvasElement> => {
    const tiles = await tileLoader(image.hash);
    const palette = getImagePalette(state, image);

    if (!tiles || !palette) {
      throw new Error('missing tiles or palette');
    }

    const isRGBN = isRGBNImage(image);
    let decoder: RGBNDecoder | Decoder;
    const lockFrame = videoLockFrame || image.lockFrame || false;
    const invertPalette = videoInvertPalette || image.invertPalette || false;
    const rotation = image.rotation || 0;

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
      decoder.update({
        canvas: null,
        tiles: tiles as string[],
        palette: (palette as Palette).palette as string[],
        lockFrame,
        invertPalette,
      });
    }

    return getRotatedCanvas(decoder.getScaledCanvas(scaleFactor || 1, exportFrameMode), rotation);
  })));

  if (unique(
    canvases.map((canvas) => (`${canvas.width}*${canvas.height}`)),
  ).length !== 1) {
    dispatch<ProgressCreateGifAction>({
      type: Actions.CREATE_GIF_PROGRESS,
      payload: 0,
    });

    dispatch<ErrorAction>({
      type: Actions.ERROR,
      payload: 'All images need to have same dimensions',
    });

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

  const addImages = getAddImages(dispatch, gifWriter, queue, frameRate, canvases.length);

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

  dispatch<ProgressCreateGifAction>({
    type: Actions.CREATE_GIF_PROGRESS,
    payload: 0,
  });
};

const animate: MiddlewareWithState = (store) => (next) => async (action) => {
  if (action.type === Actions.ANIMATE_IMAGES) {
    createAnimation(store.getState(), store.dispatch);
  }

  next(action);
};

export default animate;
