import { type ItemsState } from '@/stores/itemsStore';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { load } from '@/tools/storage';
import { Image } from '@/types/Image';

/*
  Cleanups should do modification to state objects which _do not_ require any update to the type structure
 */
export const cleanupItems = async (persistedItemsState: ItemsState): Promise<void> => {
  const { images, updateImages } = persistedItemsState;
  const imagesUpdateRequired: Image[] = [];

  const monochromeImages = images.reduce(reduceImagesMonochrome, []);

  for (const monochromeImage of monochromeImages) {
    if (!monochromeImage.lines) {
      const tiles = await load(monochromeImage.hash, '', true);
      if (tiles?.length) {
        imagesUpdateRequired.push({
          ...monochromeImage,
          lines: tiles.length,
        });
      }
    }
  }

  updateImages(imagesUpdateRequired);
};
