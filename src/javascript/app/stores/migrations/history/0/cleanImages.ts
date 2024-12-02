import dayjs from 'dayjs';
import { BlendMode } from 'gb-image-decoder';
import { dateFormat, defaultRGBNPalette } from '../../../../defaults';
import type { Image, MonochromeImage, RGBNImage } from '../../../../../../types/Image';
import { isRGBNImage } from '../../../../../tools/isRGBNImage';


export const cleanImages = (dirtyImages: Image[]): Image[] => {
  const images: Image[] = dirtyImages
    // clean the created date (add ms) (e.g. "2021-01-30 18:16:09" -> "2021-01-30 18:16:09:000")
    .map((image) => ({
      ...image,
      created: dayjs(image.created).format(dateFormat),
    }))

    // add tags array if missing
    .map((image) => ({
      ...image,
      tags: image.tags || [],
    }))

    // clean palettes
    .map((image): Image => {
      // image is a rgbn image
      if (isRGBNImage(image)) {
        const rgbnImage = { ...image as RGBNImage };

        if (!rgbnImage.palette) {
          Object.assign(rgbnImage, { palette: defaultRGBNPalette });
        }

        if (!rgbnImage.palette.blend) {
          Object.assign(rgbnImage.palette, { blend: BlendMode.MULTIPLY });
        }

        rgbnImage.frame = image.frame || undefined;
        return rgbnImage as Image;
      }

      // image is a greyscale image
      const monoImage = { ...image as MonochromeImage };
      if (typeof monoImage.framePalette === 'undefined') {
        if (monoImage.lockFrame) {
          monoImage.framePalette = 'bw';
        } else {
          monoImage.framePalette = monoImage.palette;
        }
      }


      if (typeof monoImage.lockFrame === 'undefined') {
        monoImage.lockFrame = false;
      }

      if (typeof monoImage.invertFramePalette === 'undefined') {
        monoImage.invertFramePalette = monoImage.invertPalette;
      }

      monoImage.lockFrame = true;
      monoImage.framePalette = 'ffs';
      monoImage.palette = 'bw';

      monoImage.frame = image.frame || undefined;
      return monoImage;
    });

  return images;
};
