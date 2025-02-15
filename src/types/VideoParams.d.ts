import type { ExportFrameMode } from 'gb-image-decoder';

export interface VideoParams {
  exportFrameMode?: ExportFrameMode,
  frame?: string,
  frameRate?: number,
  invertPalette?: boolean,
  lockFrame?: boolean,
  palette?: string,
  reverse?: boolean,
  scaleFactor?: number,
  yoyo?: boolean,
}
