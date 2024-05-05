import { Image, RGBNImage } from '../../../types/Image';

export const isRGBNImage = (image: Image): boolean => Boolean(
  image.hasOwnProperty('hashes') && (image as RGBNImage).hashes,
);
