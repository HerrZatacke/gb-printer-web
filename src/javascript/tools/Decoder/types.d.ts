import { IndexedTilePixels } from '../../../types/FixedArray';

export interface IndexedRGBNValue {
  r: number,
  g: number,
  b: number,
  n?: number,
}

export interface RGBValue {
  r: number,
  g: number,
  b: number,
}

export interface ChangedTile {
  index: number,
  newTile: string,
}

export interface ScaledCanvasSize {
  initialHeight: number,
  initialWidth: number,
  tilesPerLine: number,
}

export interface RGBNTile {
  r: string,
  b: string,
  g: string,
  n: string,
}

export interface RGBNIndexedTilePixels {
  r: IndexedTilePixels,
  g: IndexedTilePixels,
  b: IndexedTilePixels,
  n?: IndexedTilePixels,
}

export interface ChangedRGBNTile {
  index: number,
  newTile: RGBNTile,
}
