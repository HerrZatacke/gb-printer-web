import { State } from '../../app/store/State';
import { Image, RGBNPalette } from '../../../types/Image';
import { Palette } from '../../../types/Palette';
import { isRGBNImage } from '../isRGBNImage';

const getImagePalette = ({ palettes }: State, image: Image): RGBNPalette | Palette | undefined => {
  const { palette } = image;
  return isRGBNImage(image) ?
    palette as RGBNPalette :
    (palettes.find(({ shortName }) => shortName === palette));
};

export default getImagePalette;
