import { type Sample, type SSTVSettings } from '@/tools/sstv/types';

export const blobToImageData = async (blob: Blob, { width, height }: SSTVSettings, paddingColor: string): Promise<ImageData> => {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = paddingColor;
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(width / bitmap.width, height / bitmap.height);

  const drawW = bitmap.width * scale;
  const drawH = bitmap.height * scale;

  const dx = (width - drawW) / 2;
  const dy = (height - drawH) / 2;

  ctx.drawImage(bitmap, dx, dy, drawW, drawH);

  return ctx.getImageData(0, 0, width, height);
};

export const valueToSample = (freq: number, durationMs: number): Sample => ({
  freq,
  durationMs,
});

export const pixelToFreq = (settings: SSTVSettings, value: number) => {
  return settings.freqBlack + (value / 255) * (settings.freqWhite - settings.freqBlack);
};
