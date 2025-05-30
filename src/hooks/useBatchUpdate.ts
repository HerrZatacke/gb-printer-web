import { useCallback } from 'react';
import type { RGBNPalette } from 'gb-image-decoder';
import useEditStore from '../app/stores/editStore';
import useFiltersStore from '../app/stores/filtersStore';
import useItemsStore from '../app/stores/itemsStore';
import { addSortIndex, removeSortIndex, sortImages } from '../tools/sortImages';
import applyTagChanges from '../tools/applyTagChanges';
import { Updatable, UpdatableMonochrome, UPDATATABLES } from '../consts/batchActionTypes';
import { isRGBNImage } from '../tools/isRGBNImage';
import type { Image, MonochromeImage, RGBNImage } from '../../types/Image';
import type { TagUpdates } from '../tools/modifyTagChanges';
import type { ImageUpdatable } from '../consts/batchActionTypes';
import type { ImageUpdates } from '../../types/ImageActions';
import { useStores } from './useStores';

interface BatchUpdateImagesParams {
  shouldUpdate: Record<keyof ImageUpdates | 'tags', boolean>,
  updates: ImageUpdates,
  tagChanges: TagUpdates,
}

interface UseBatchUpdateImages {
  batchUpdateImages: (options: BatchUpdateImagesParams) => void,
}

const useBatchUpdateImages = (): UseBatchUpdateImages => {
  const { editImages, cancelEditImages } = useEditStore();
  const { sortBy } = useFiltersStore();
  const { images } = useItemsStore();
  const { updateImages } = useStores();

  const batchUpdateImages = useCallback(({ shouldUpdate, updates, tagChanges }: BatchUpdateImagesParams): void => {
    const sortFunc = sortImages(sortBy);

    const currentEditHashes: string[] = editImages?.batch || [];

    if (shouldUpdate && currentEditHashes?.length) {

      const imagesInBatch = currentEditHashes.reduce((acc: Image[], selcetionHash: string): Image[] => {
        const img = images.find(({ hash }) => hash === selcetionHash);
        return img ? [...acc, img] : acc;
      }, [])
        .map(addSortIndex)
        .sort(sortFunc)
        .map(removeSortIndex);

      const updatedImages = imagesInBatch
        .map((updateImage, selectionIndex): Image => (
          UPDATATABLES.reduce((image: Image, updatable: ImageUpdatable): Image => {
            if (!shouldUpdate[updatable as keyof ImageUpdates]) {
              return image;
            }

            // First handle "common properties" ...
            switch (updatable) {
              case Updatable.TITLE: {
                return {
                  ...image,
                  title: updates.title.replace(/%(n+)/gi, (_, group) => (
                    (selectionIndex + 1)
                      .toString(10)
                      .padStart(group.length, '0')
                  )),
                };
              }

              case Updatable.TAGS: {
                const tags = applyTagChanges({
                  ...tagChanges,
                  initial: image.tags,
                });

                return {
                  ...image,
                  tags,
                };
              }

              case Updatable.ROTATION:
              case Updatable.LOCK_FRAME:
              case Updatable.FRAME:
              case Updatable.CREATED: {
                return {
                  ...image,
                  [updatable]: updates[updatable],
                };
              }

              default:
                break;
            }

            // ... then handle type-specific properties
            if (isRGBNImage(image)) {
              const img = image as RGBNImage;
              switch (updatable) {
                case Updatable.PALETTE: {
                  return {
                    ...img,
                    palette: updates.palette as RGBNPalette,
                  };
                }

                default:
                  return img;
              }
            } else {
              const img = image as MonochromeImage;
              switch (updatable) {
                case Updatable.PALETTE:
                case UpdatableMonochrome.FRAME_PALETTE:
                case UpdatableMonochrome.INVERT_FRAME_PALETTE:
                case UpdatableMonochrome.INVERT_PALETTE: {
                  return {
                    ...img,
                    [updatable]: updates[updatable],
                  };
                }

                default:
                  return img;
              }
            }

          }, updateImage)
        ));

      updateImages(updatedImages);
    }

    cancelEditImages();
  }, [cancelEditImages, editImages?.batch, images, sortBy, updateImages]);

  return { batchUpdateImages };
};

export default useBatchUpdateImages;

