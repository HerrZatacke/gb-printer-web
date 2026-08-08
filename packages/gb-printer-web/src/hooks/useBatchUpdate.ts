import { useQueryClient } from '@tanstack/react-query';
import { type RGBNPalette } from 'gb-image-decoder';
import { fromCreationDate, toCreationDate, type Image, type MonochromeImage, type RGBNImage } from 'gb-printer-schemas';
import { useCallback, useMemo } from 'react';
import { Updatable, UpdatableMonochrome, UPDATATABLES, type ImageUpdatable } from '@/consts/batchActionTypes';
import { useStores } from '@/hooks/useStores';
import { imagesByHashesQueryOptions } from '@/stores/items/queries/images';
import { useEditStore, useFiltersStore } from '@/stores/stores';
import applyTagChanges from '@/tools/applyTagChanges';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { type TagUpdates } from '@/tools/modifyTagChanges';
import sortBy from '@/tools/sortby';
import { type ImageUpdates } from '@/types/ImageActions';
import { SortDirection } from '@/workers/itemsIndexedDbWorker/schemas';

interface BatchUpdateImagesParams {
  shouldUpdate: Record<keyof ImageUpdates | 'tags', boolean>;
  updates: ImageUpdates;
  tagChanges: TagUpdates;
}

interface UseBatchUpdateImages {
  batchUpdateImages: (options: BatchUpdateImagesParams) => void;
}

const useBatchUpdateImages = (): UseBatchUpdateImages => {
  const { editImages, cancelEditImages } = useEditStore();
  const { sortBy: sortByState } = useFiltersStore();
  const queryClient = useQueryClient();
  const { updateImages } = useStores();

  const sortFunc = useMemo<(i: Image[]) => Image[]>(() => {
    const [sortByKey, sortByDirection] = sortByState.split('_') as [keyof Image, SortDirection];
    return sortBy<Image>(sortByKey, sortByDirection);
  }, [sortByState]);

  const batchUpdateImages = useCallback(async ({ shouldUpdate, updates, tagChanges }: BatchUpdateImagesParams): Promise<void> => {
    const currentEditHashes: string[] = editImages?.batch || [];

    if (shouldUpdate && currentEditHashes?.length) {
      const { items: foundImages } = await queryClient.fetchQuery(imagesByHashesQueryOptions(currentEditHashes));

      const imagesInBatch = foundImages
        .filter((img): img is Image => Boolean(img));

      const updatedImages = sortFunc(imagesInBatch)
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
              case Updatable.FRAME:{
                return {
                  ...image,
                  [updatable]: updates[updatable],
                };
              }

              case Updatable.CREATED: {
                const dateObject = fromCreationDate(updates[updatable]);

                // Adding index to milliseconds to ensure proper sorting
                // see also src/hooks/useRunImport.ts which adds the index during import
                return {
                  ...image,
                  [updatable]: toCreationDate(dateObject.getTime() + selectionIndex),
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
  }, [cancelEditImages, editImages?.batch, queryClient, sortFunc, updateImages]);

  return { batchUpdateImages };
};

export default useBatchUpdateImages;

