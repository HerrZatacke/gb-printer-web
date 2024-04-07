import { BWPalette, IndexedTilePixels } from '../../../types/FixedArray';
import { BLACK, BW_PALETTE, TILE_PIXEL_HEIGHT, TILE_PIXEL_WIDTH } from './constants';
import { ExportFrameMode } from '../../consts/exportFrameModes';
import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { RGBValue } from './types';

// Gameboy tile decoder function from http://www.huderlem.com/demos/gameboy2bpp.html
export const decodeTile = (rawBytes: string = BLACK): IndexedTilePixels => {
  const bytes = rawBytes.replace(/[^0-9A-F]/ig, '')
    .padEnd(32, 'f');

  const byteArray = new Array(16);
  for (let i = 0; i < byteArray.length; i += 1) {
    byteArray[i] = parseInt(bytes.substr(i * 2, 2), 16);
  }

  const pixels = new Array(TILE_PIXEL_WIDTH * TILE_PIXEL_HEIGHT) as IndexedTilePixels;

  for (let y = 0; y < TILE_PIXEL_HEIGHT; y += 1) {
    for (let x = 0; x < TILE_PIXEL_WIDTH; x += 1) {
      // eslint-disable-next-line no-bitwise
      const hiBit = (byteArray[(y * 2) + 1] >> (7 - x)) & 1;
      // eslint-disable-next-line no-bitwise
      const loBit = (byteArray[y * 2] >> (7 - x)) & 1;
      // eslint-disable-next-line no-bitwise
      pixels[(y * TILE_PIXEL_WIDTH) + x] = (hiBit << 1) | loBit;
    }
  }

  return pixels;
};

export const getRGBValue = ({
  pixels,
  index,
  tileIndex,
  handleExportFrame,
  lockFrame,
  invertPalette,
  colorData,
}: {
  pixels: IndexedTilePixels,
  index: number,
  tileIndex: number,
  handleExportFrame: ExportFrameMode,
  lockFrame: boolean,
  invertPalette: boolean,
  colorData: BWPalette,
}): RGBValue => {
  const palette: BWPalette = (
    lockFrame && // Must be actually locked
    handleExportFrame !== ExportFrameMode.FRAMEMODE_CROP &&
    tileIndexIsPartOfFrame(tileIndex, handleExportFrame) // Current tile must be in a "lockable" position
  ) ? BW_PALETTE : colorData;
  const value: number = invertPalette ? palette[3 - pixels[index]] : palette[pixels[index]];

  return {
    // eslint-disable-next-line no-bitwise
    r: (value & 0xff0000) >> 16,
    // eslint-disable-next-line no-bitwise
    g: (value & 0x00ff00) >> 8,
    // eslint-disable-next-line no-bitwise
    b: (value & 0x0000ff),
  };
};
