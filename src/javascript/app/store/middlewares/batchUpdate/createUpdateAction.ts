import type { RGBNPalette } from 'gb-image-decoder';
import type { ImagesBatchUpdateAction, ImagesUpdateAction, ImageUpdates } from '../../../../../types/actions/ImageActions';
import { Actions } from '../../actions';
import { addSortIndex, removeSortIndex, sortImages } from '../../../../tools/sortImages';
import type { Image, MonochromeImage, RGBNImage } from '../../../../../types/Image';
import type { TagUpdates } from '../../../../tools/modifyTagChanges';
import type { ImageUpdatable } from './const';
import applyTagChanges from '../../../../tools/applyTagChanges';
import type { State } from '../../State';
import { Updatable, UpdatableMonochrome, UPDATATABLES } from './const';
import { isRGBNImage } from '../../../../tools/isRGBNImage';

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
        UPDATATABLES.reduce((image: Image, updatable: ImageUpdatable): Image => {
          if (!shouldUpdate[updatable as keyof ImageUpdates]) {
            return image;
          }

          // First handle "common properties" ...
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
                [updatable]: editedUpdates[updatable],
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
                  palette: editedUpdates.palette as RGBNPalette,
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
                  [updatable]: editedUpdates[updatable],
                };
              }

              default:
                return img;
            }
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
