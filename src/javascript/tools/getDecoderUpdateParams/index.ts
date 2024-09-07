import type { DecoderUpdateParams, RGBNPalette } from 'gb-image-decoder';
import { BW_PALETTE_HEX } from 'gb-image-decoder';

interface Params {
  palette?: string[] | RGBNPalette,
  invertPalette?: boolean,
  framePalette?: string[],
  invertFramePalette?: boolean,
}

export const getDecoderUpdateParams = ({
  palette,
  framePalette,
  invertPalette = false,
  invertFramePalette = false,
}: Params): Pick<DecoderUpdateParams, 'palette' | 'framePalette'> => {

  const iPalette = (palette || BW_PALETTE_HEX) as string[];
  const fPalette = framePalette || iPalette;

  return {
    palette: invertPalette ? [...iPalette].reverse() : [...iPalette],
    framePalette: invertFramePalette ? [...fPalette].reverse() : [...fPalette],
  };
};
