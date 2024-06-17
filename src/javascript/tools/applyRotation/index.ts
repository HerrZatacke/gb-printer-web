/* eslint-disable no-param-reassign */

export enum Rotation {
  DEG_0 = 0,
  DEG_90 = 1,
  DEG_180 = 2,
  DEG_270 = 3,
}

export const applyRotation = (
  srcCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  rotation: Rotation,
): void => {
  const context = targetCanvas.getContext('2d');
  if (!context) {
    throw new Error('No canvas context');
  }

  context.resetTransform();

  if (rotation % 2) {
    targetCanvas.height = srcCanvas.width;
    targetCanvas.width = srcCanvas.height;
  } else {
    targetCanvas.width = srcCanvas.width;
    targetCanvas.height = srcCanvas.height;
  }

  switch (rotation) {
    case 1:
      context.translate(srcCanvas.height, 0);
      break;
    case 2:
      context.translate(srcCanvas.width, srcCanvas.height);
      break;
    case 3:
      context.translate(0, srcCanvas.width);
      break;
    default:
      break;
  }

  context.rotate(rotation * 90 * Math.PI / 180);
  context.drawImage(srcCanvas, 0, 0);
};

export const getRotatedCanvas = (srcCanvas: HTMLCanvasElement, rotation: Rotation): HTMLCanvasElement => {
  const targetCanvas = document.createElement('canvas');
  applyRotation(srcCanvas, targetCanvas, rotation);
  return targetCanvas;
};
