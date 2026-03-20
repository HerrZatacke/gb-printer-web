import { type Sample, type SSTVSettings } from '@/tools/sstv/types';

export const blobToImageData = async (blob: Blob, width: number, height: number): Promise<ImageDataArray> => {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bitmap, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height).data;
};

export const valueToSample = (freq: number, durationMs: number): Sample => ({
  freq,
  durationMs,
});

export const pixelToFreq = (settings: SSTVSettings, value: number) => {
  return settings.freqBlack + (value / 255) * (settings.freqWhite - settings.freqBlack);
};
