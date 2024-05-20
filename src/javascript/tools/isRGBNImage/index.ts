import { Image, MonochromeImage, RGBNImage } from '../../../types/Image';

export const isRGBNImage = (image: Image): boolean => Boolean(
  image.hasOwnProperty('hashes') && (image as RGBNImage).hashes,
);

export const reduceImagesMonochrome = (acc: MonochromeImage[], image?: Image): MonochromeImage[] => (
  (!image || isRGBNImage(image)) ? acc : [...acc, (image as MonochromeImage)]
);

export const reduceImagesRGBN = (acc: RGBNImage[], image?: Image): RGBNImage[] => (
  (!image || !isRGBNImage(image)) ? acc : [...acc, (image as RGBNImage)]
);
