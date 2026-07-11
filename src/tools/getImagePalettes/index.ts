import { type RGBNPalette } from 'gb-image-decoder';
import { missingGreyPalette } from '@/consts/defaults';
import { getQueryClient } from '@/contexts/QueryClient';
import { palettesListQueryOptions } from '@/stores/queries/palettes';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { type Image, type MonochromeImage } from '@/types/Image';
import { type Palette } from '@/types/Palette';

export interface ImagePalettes {
  palette?: RGBNPalette | Palette;
  framePalette?: Palette;
}

export const getImagePalettes = async (image: Image): Promise<ImagePalettes> => {
  if (isRGBNImage(image)) {
    const { palette } = image;
    return {
      palette: palette as RGBNPalette,
    };
  }

  const monoImage = image as MonochromeImage;

  const queryClient = getQueryClient();
  const { items: palettes } = await queryClient.fetchQuery(palettesListQueryOptions());

  const palette = palettes.find(({ shortName }) => shortName === monoImage.palette) || missingGreyPalette;
  const framePalette = palettes.find(({ shortName }) => shortName === monoImage.framePalette) || missingGreyPalette;

  return {
    palette,
    framePalette: monoImage.lockFrame ? framePalette : palette,
  };
};
