import type { RGBNPalette } from 'gb-image-decoder';
import type { State } from '../../app/store/State';
import type { Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import { isRGBNImage } from '../isRGBNImage';

const getImagePalette = ({ palettes }: State, image: Image): RGBNPalette | Palette | undefined => {
  const { palette } = image;
  return isRGBNImage(image) ?
    palette as RGBNPalette :
    (palettes.find(({ shortName }) => shortName === palette));
};

export default getImagePalette;
