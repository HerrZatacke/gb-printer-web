import type { RGBNPalette } from 'gb-image-decoder';
import { missingGreyPalette } from '@/consts/defaults';
import { isRGBNImage } from '@/tools/isRGBNImage';
import type { Image, MonochromeImage } from '@/types/Image';
import type { Palette } from '@/types/Palette';

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
