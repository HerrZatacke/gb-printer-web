import type { Canvas } from 'canvas';
import { createCanvas, createImageData } from 'canvas';
import { ChannelKey, RGBNDecoder, ExportFrameMode } from 'gb-image-decoder';
import type { ImportItem } from '../../../types/ImportItem';

export type RGBNImportItem = Partial<Record<ChannelKey, ImportItem>>

export type RGBNBrackets = Partial<Record<ChannelKey, ImportItem[]>>

export const rgbToCanvas = async (images: RGBNImportItem): Promise<Canvas> => {

  const decoder = new RGBNDecoder({
    canvasCreator: () => (
      createCanvas(1, 1) as unknown as HTMLCanvasElement
    ),
    imageDataCreator: (rawImageData, width, height) => (
      createImageData(rawImageData, width, height) as unknown as ImageData
    ),
  });

  await decoder.update({
    canvas: null,
    palette: {
      [ChannelKey.R]: [0, 85, 170, 255],
      [ChannelKey.G]: [0, 85, 170, 255],
      [ChannelKey.B]: [0, 85, 170, 255],
      [ChannelKey.N]: [0, 85, 170, 255],
    },
    tiles: {
      [ChannelKey.R]: images.r?.tiles,
      [ChannelKey.G]: images.g?.tiles,
      [ChannelKey.B]: images.b?.tiles,
      [ChannelKey.N]: images.n?.tiles,
    },
  });

  const scaledCanvas = decoder.getScaledCanvas(4, ExportFrameMode.FRAMEMODE_CROP);

  return scaledCanvas as unknown as Canvas;
};
