import getFilteredImages from '../../../tools/getFilteredImages';
import unique from '../../../tools/unique';
import { Actions } from '../actions';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { Image } from '../../../../types/Image';
import {
  DeleteImagesAction,
  DownloadImageSelectionAction,
  EditImageSelectionAction,
} from '../../../../types/actions/ImageActions';
import { SetVideoParamsAction } from '../../../../types/actions/VideoParamsOptions';
import { ImageSelectionSetAction } from '../../../../types/actions/ImageSelectionActions';
import { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';
import { BatchActionType } from '../../../consts/batchActionTypes';

const collectTags = (batchImages: Image[]): string[] => (
  unique(batchImages.map(({ tags }) => tags).flat())
);

const batch: MiddlewareWithState = (store) => (next) => (action) => {

  if (action.type === Actions.IMAGE_SELECTION_SHIFTCLICK) {
    const state = store.getState();
    const images = getFilteredImages(state);
    const { lastSelectedImage, pageSize } = state;
    const selectedIndex = images.findIndex(({ hash }) => hash === action.payload);
    let prevSelectedIndex = images.findIndex(({ hash }) => hash === lastSelectedImage);
    if (prevSelectedIndex === -1) {
      prevSelectedIndex = action.page * pageSize;
    }

    const from = Math.min(prevSelectedIndex, selectedIndex);
    const to = Math.max(prevSelectedIndex, selectedIndex);

    store.dispatch<ImageSelectionSetAction>({
      type: Actions.IMAGE_SELECTION_SET,
      payload: images.slice(from, to + 1).map(({ hash }) => hash),
    });
  }

  if (action.type === Actions.BATCH_TASK) {
    const state = store.getState();
    const { images, imageSelection, pageSize } = state;
    // const batchImages = images.filter(({ hash }) => imageSelection.includes(hash));

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

        case BatchActionType.ANIMATE:
          store.dispatch<SetVideoParamsAction>({
            type: Actions.SET_VIDEO_PARAMS,
            payload: {
              imageSelection,
            },
          });
          break;
        case BatchActionType.DOWNLOAD:
          store.dispatch<DownloadImageSelectionAction>({
            type: Actions.DOWNLOAD_SELECTION,
            payload: imageSelection,
          });
          break;
        case BatchActionType.EDIT:
          store.dispatch<EditImageSelectionAction>({
            type: Actions.EDIT_IMAGE_SELECTION,
            payload: {
              tags: collectTags(batchImages),
              batch: batchImages.map(({ hash }) => hash),
            },
          });
          break;
        default:
          break;
      }
    }

    switch (action.payload) {
      case BatchActionType.CHECKALL:
        store.dispatch<ImageSelectionSetAction>({
          type: Actions.IMAGE_SELECTION_SET,
          payload: getFilteredImages(state)
            .slice(action.page * pageSize, (action.page + 1) * pageSize || undefined)
            .map(({ hash }) => hash),
        } as ImageSelectionSetAction);
        break;

      case BatchActionType.UNCHECKALL:
        store.dispatch<ImageSelectionSetAction>({
          type: Actions.IMAGE_SELECTION_SET,
          payload: [],
        });
        break;

      default:
        break;
    }

    return;
  }

  next(action);
};

export default batch;
