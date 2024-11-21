import dayjs from 'dayjs';
import { BlendMode } from 'gb-image-decoder';
import useItemsStore from '../../app/stores/itemsStore';
import { dateFormat, defaultRGBNPalette } from '../../app/defaults';
import type { State } from '../../app/store/State';
import { isRGBNImage } from '../isRGBNImage';
import type { Image, MonochromeImage, RGBNImage } from '../../../types/Image';

const cleanState = async (dirtyState: Partial<State>): Promise<Partial<State>> => {
  const palettesShorts = useItemsStore.getState().palettes.map(({ shortName }) => shortName);

  const images: Image[] = (dirtyState.images || [])
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
      // if palette does not exist, update image to use default (first of list)
      if (!palettesShorts.includes(monoImage.palette) && !monoImage.palette) {
        Object.assign(monoImage, { palette: palettesShorts[0] || 'bw' });
      }

      if (typeof monoImage.framePalette === 'undefined') {
        if (monoImage.lockFrame) {
          Object.assign(monoImage, { framePalette: 'bw' });
        } else {
          Object.assign(monoImage, { framePalette: monoImage.palette });
        }
      }

      if (typeof monoImage.lockFrame === 'undefined') {
        Object.assign(monoImage, { lockFrame: false });
      }

      if (typeof monoImage.invertFramePalette === 'undefined') {
        Object.assign(monoImage, { invertFramePalette: monoImage.invertPalette });
      }

      monoImage.frame = image.frame || undefined;
      return monoImage;
    });

  return {
    ...dirtyState,
    images,
  };
};

export default cleanState;
