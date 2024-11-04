import unique from '../../../tools/unique';
import { Actions } from '../actions';
import useFiltersStore from '../../stores/filtersStore';
import useInteractionsStore from '../../stores/interactionsStore';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { Image } from '../../../../types/Image';
import type { DeleteImagesAction,
  DownloadImageSelectionAction,
  EditImageSelectionAction,
  StartCreateRGBImagesAction } from '../../../../types/actions/ImageActions';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import { BatchActionType } from '../../../consts/batchActionTypes';
import { reduceImagesMonochrome } from '../../../tools/isRGBNImage';


const collectTags = (batchImages: Image[]): string[] => (
  unique(batchImages.map(({ tags }) => tags).flat())
);

const batch: MiddlewareWithState = (store) => (next) => (action) => {
  const { imageSelection } = useFiltersStore.getState();

  if (action.type === Actions.BATCH_TASK) {
    const { images } = store.getState();

    const batchImages = imageSelection.reduce((acc: Image[], selHash: string): Image[] => {
      const image = images.find(({ hash }) => hash === selHash);
      return image ? [image, ...acc] : acc;
    }, []);

    if (imageSelection.length) {
      switch (action.payload as BatchActionType) {
        case BatchActionType.DELETE: {
          store.dispatch<ConfirmAskAction>({
            type: Actions.CONFIRM_ASK,
            payload: {
              message: `Delete ${imageSelection.length} images?`,
              confirm: async () => {
                store.dispatch<DeleteImagesAction>({
                  type: Actions.DELETE_IMAGES,
                  payload: imageSelection,
                });
              },
              deny: async () => {
                store.dispatch<ConfirmAnsweredAction>({
                  type: Actions.CONFIRM_ANSWERED,
                });
              },
            },
          });

          break;
        }

        case BatchActionType.ANIMATE: {
          useInteractionsStore.getState().setVideoSelection(imageSelection);
          break;
        }

        case BatchActionType.DOWNLOAD: {
          store.dispatch<DownloadImageSelectionAction>({
            type: Actions.DOWNLOAD_SELECTION,
            payload: imageSelection,
          });
          break;
        }

        case BatchActionType.EDIT: {
          store.dispatch<EditImageSelectionAction>({
            type: Actions.EDIT_IMAGE_SELECTION,
            payload: {
              tags: collectTags(batchImages),
              batch: batchImages.map(({ hash }) => hash),
            },
          });
          break;
        }

        case BatchActionType.RGB: {
          store.dispatch<StartCreateRGBImagesAction>({
            type: Actions.START_CREATE_RGB_IMAGES,
            payload: batchImages.reduce(reduceImagesMonochrome, []).map(({ hash }) => hash),
          });
          break;
        }

        default:
          break;
      }
    }

    return;
  }

  next(action);
};

export default batch;
