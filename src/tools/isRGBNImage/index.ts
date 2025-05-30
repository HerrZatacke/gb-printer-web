import type { RGBNPalette } from 'gb-image-decoder';
import type { Image, MonochromeImage, RGBNImage } from '@/types/Image';

export const isRGBNImage = (image: Image): boolean => Boolean(
  image.hasOwnProperty('hashes') && (image as RGBNImage).hashes,
);

export const reduceImagesMonochrome = (acc: MonochromeImage[], image?: Image | null): MonochromeImage[] => (
  (!image || isRGBNImage(image)) ? acc : [...acc, (image as MonochromeImage)]
);

export const reduceImagesRGBN = (acc: RGBNImage[], image?: Image | null): RGBNImage[] => (
  (!image || !isRGBNImage(image)) ? acc : [...acc, (image as RGBNImage)]
);

export const isRGBNPalette = (palette: RGBNPalette | string): boolean => Boolean(
  (palette.hasOwnProperty('r') && (palette as RGBNPalette).r) ||
    (palette.hasOwnProperty('g') && (palette as RGBNPalette).g) ||
    (palette.hasOwnProperty('b') && (palette as RGBNPalette).b) ||
    (palette.hasOwnProperty('n') && (palette as RGBNPalette).n) ||
    (palette.hasOwnProperty('blend') && (palette as RGBNPalette).blend),
);
