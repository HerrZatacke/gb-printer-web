import { type RGBNPalette } from 'gb-image-decoder';
import { missingGreyPalette } from '@/consts/defaults';
import { getQueryClient } from '@/contexts/QueryClient';
import { paletteByShortNameQueryOptions } from '@/stores/items/queries/palettes';
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
  const [foundPalette, foundFramePalette] = await Promise.all([
    monoImage.palette ? queryClient.fetchQuery(paletteByShortNameQueryOptions(monoImage.palette)) : undefined,
    monoImage.framePalette ? queryClient.fetchQuery(paletteByShortNameQueryOptions(monoImage.framePalette)) : undefined,
  ]);

  return {
    palette: foundPalette || missingGreyPalette,
    framePalette: (monoImage.lockFrame ? foundFramePalette : foundPalette) || missingGreyPalette,
  };
};
