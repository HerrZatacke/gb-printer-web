import type { RGBNPalette } from 'gb-image-decoder';
import type { Image, MonochromeImage } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import { isRGBNImage } from '../isRGBNImage';
import { missingGreyPalette } from '../../app/defaults';

interface GetImagePalettes {
  palette?: RGBNPalette | Palette,
  framePalette?: Palette
}

export const getImagePalettes = (palettes: Palette[], image: Image): GetImagePalettes => {
  if (isRGBNImage(image)) {
    const { palette } = image;
    return {
      palette: palette as RGBNPalette,
    };
  }

  const monoImage = image as MonochromeImage;

  const palette = palettes.find(({ shortName }) => shortName === monoImage.palette) || missingGreyPalette;
  const framePalette = palettes.find(({ shortName }) => shortName === monoImage.framePalette) || missingGreyPalette;

  return {
    palette,
    framePalette: monoImage.lockFrame ? framePalette : palette,
  };
};
