import type { RGBNPalette } from 'gb-image-decoder';
import type { ImagesBatchUpdateAction, ImagesUpdateAction, ImageUpdates } from '../../../../../types/actions/ImageActions';
import { Actions } from '../../actions';
import { addSortIndex, removeSortIndex, sortImages } from '../../../../tools/sortImages';
import type { Image, MonochromeImage, RGBNImage } from '../../../../../types/Image';
import type { TagUpdates } from '../../../../tools/modifyTagChanges';
import applyTagChanges from '../../../../tools/applyTagChanges';
import type { State } from '../../State';
import { Updatable, UPDATATABLES } from './const';
import { isRGBNImage, isRGBNPalette } from '../../../../tools/isRGBNImage';

export const createUpdateAction = (action: ImagesBatchUpdateAction, state: State): ImagesUpdateAction | null => {
  const sortFunc = sortImages(state);

  const currentEditHashes: string[] | undefined = state.editImage?.batch;
  // const initialTags: string[] | undefined = state.editImage?.tags || [];
  const images: Image[] = state.images;

  const shouldUpdate: Record<keyof ImageUpdates, boolean> = action.payload.shouldUpdate;
  const editedUpdates: ImageUpdates = action.payload.updates;
  const tagChanges: TagUpdates = action.payload.tagChanges;

  if (shouldUpdate && currentEditHashes && currentEditHashes.length) {

    const imagesInBatch = currentEditHashes.reduce((acc: Image[], selcetionHash: string): Image[] => {
      const img = images.find(({ hash }) => hash === selcetionHash);
      return img ? [...acc, img] : acc;
    }, [])
      .map(addSortIndex)
      .sort(sortFunc)
      .map(removeSortIndex);

    const updatedImages = imagesInBatch
      .map((updateImage, selectionIndex): Image => (
        UPDATATABLES.reduce((image: Image, updatable: keyof Image): Image => {
          if (!shouldUpdate[updatable as keyof ImageUpdates]) {
            return image;
          }

          switch (updatable) {
            case Updatable.TITLE: {
              return {
                ...image,
                title: editedUpdates.title.replace(/%(n+)/gi, (_, group) => (
                  (selectionIndex + 1)
                    .toString(10)
                    .padStart(group.length, '0')
                )),
              };
            }

            case Updatable.PALETTE: {
              const imageIsRGBN = isRGBNImage(image);
              const paletteIsRGBN = isRGBNPalette(editedUpdates.palette);

              if (imageIsRGBN && paletteIsRGBN) {
                return {
                  ...image as RGBNImage,
                  palette: editedUpdates.palette as RGBNPalette,
                };
              }

              if (!imageIsRGBN && !paletteIsRGBN) {
                return {
                  ...image as MonochromeImage,
                  palette: editedUpdates.palette as string,
                };
              }

              return image;
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
            case Updatable.INVERT_PALETTE:
            case Updatable.CREATED: {
              return {
                ...image,
                [updatable]: editedUpdates[updatable],
              };
            }

            default:
              return image;
          }
        }, updateImage)
      ));

    return {
      type: Actions.UPDATE_IMAGES,
      payload: updatedImages,
    };
  }

  return null;
};
