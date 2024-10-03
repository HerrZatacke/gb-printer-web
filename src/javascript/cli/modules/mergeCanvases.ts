import type { Canvas } from 'canvas';
import { createCanvas } from 'canvas';

export const mergeCanvases = async (canvases: Canvas[]): Promise<Canvas> => {
  const average = createCanvas(canvases[0].width, canvases[0].height);

  const context = average.getContext('2d');

  canvases.forEach((canvas, index) => {
    context.globalAlpha = 1 / (index + 1);
    context.drawImage(canvas, 0, 0);
  });

  return average;
};
