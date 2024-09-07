import type { RGBNPalette } from 'gb-image-decoder';
import type { State } from '../../app/store/State';
import type { Image, MonochromeImage } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import { isRGBNImage } from '../isRGBNImage';

interface GetImagePalettes {
  palette?: RGBNPalette | Palette,
  framePalette?: Palette
}

const getImagePalettes = ({ palettes }: State, image: Image): GetImagePalettes => {
  if (isRGBNImage(image)) {
    const { palette } = image;
    return {
      palette: palette as RGBNPalette,
    };
  }

  return {
    palette: palettes.find(({ shortName }) => shortName === image.palette),
    framePalette: palettes.find(({ shortName }) => shortName === (image as MonochromeImage).framePalette),
  };
};

export default getImagePalettes;
