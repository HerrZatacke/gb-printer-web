import type { MonochromeImageCreationParams } from 'gb-image-decoder';
import { BW_PALETTE_HEX } from 'gb-image-decoder';

interface Params {
  imagePalette?: string[],
  invertPalette?: boolean,
  framePalette?: string[],
  invertFramePalette?: boolean,
}


export const hexToNumeric = (hex: string): number => {
  const cleanHex = hex.replace('#', '');
  if (!/^([0-9a-fA-F]{6})$/.test(cleanHex)) {
    throw new Error('Invalid hex color');
  }

  return parseInt(cleanHex, 16);
};

export const getMonochromeImageCreationParams = ({
  imagePalette,
  framePalette,
  invertPalette = false,
  invertFramePalette = false,
}: Params): Pick<MonochromeImageCreationParams, 'imagePalette' | 'framePalette'> => {

  const iPalette = ((imagePalette || BW_PALETTE_HEX) as string[]).map(hexToNumeric);
  const fPalette = (framePalette?.map(hexToNumeric) || iPalette);

  return {
    imagePalette: invertPalette ? [...iPalette].reverse() : [...iPalette],
    framePalette: invertFramePalette ? [...fPalette].reverse() : [...fPalette],
  };
};
