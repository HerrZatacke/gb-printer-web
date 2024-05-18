import { ExportFrameMode } from '../javascript/consts/exportFrameModes';

export interface VideoParams {
  imageSelection?: string[],
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
