import { getImagePalettes } from '@/tools/getImagePalettes';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { type Image } from '@/types/Image';
import { type Palette } from '@/types/Palette';

export const getPaddingColor = (images: Image[], palettes: Palette[], imageHash: string) => {
  const image = images.find(({ hash }) => hash === imageHash);
  if (!image) {
    throw new Error('image not found');
  }

  if (isRGBNImage(image)) {
    return '#000';
  }

  const palette = getImagePalettes(palettes, image).framePalette;

  if (!palette) {
    return '#000';
  }

  return palette.palette[3];
};
