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
import { ConfirmAskAction } from '../../../../types/actions/ConfirmActions';

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

    store.dispatch({
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
      switch (action.payload) {
        case 'delete': {
          store.dispatch({
            type: Actions.CONFIRM_ASK,
            payload: {
              message: `Delete ${imageSelection.length} images?`,
              confirm: () => {
                store.dispatch({
                  type: Actions.DELETE_IMAGES,
                  payload: imageSelection,
                } as DeleteImagesAction);
              },
              deny: () => {
                store.dispatch({
                  type: Actions.CONFIRM_ANSWERED,
                });
              },
            },
          } as ConfirmAskAction);

          break;
        }

        case 'animate':
          store.dispatch({
            type: Actions.SET_VIDEO_PARAMS,
            payload: {
              imageSelection,
            },
          } as SetVideoParamsAction);
          break;
        case 'download':
          store.dispatch({
            type: Actions.DOWNLOAD_SELECTION,
            payload: imageSelection,
          } as DownloadImageSelectionAction);
          break;
        case 'edit':
          store.dispatch({
            type: Actions.EDIT_IMAGE_SELECTION,
            payload: {
              hash: batchImages[0].hash,
              tags: collectTags(batchImages),
              batch: batchImages.map(({ hash }) => hash),
            },
          } as EditImageSelectionAction);
          break;
        default:
          break;
      }
    }

    switch (action.payload) {
      case 'checkall':
        store.dispatch({
          type: Actions.IMAGE_SELECTION_SET,
          payload: getFilteredImages(state)
            .slice(action.page * pageSize, (action.page + 1) * pageSize || undefined)
            .map(({ hash }) => hash),
        } as ImageSelectionSetAction);
        break;

      case 'uncheckall':
        store.dispatch({
          type: Actions.IMAGE_SELECTION_SET,
          payload: [],
        } as ImageSelectionSetAction);
        break;

      default:
        break;
    }

    return;
  }

  next(action);
};

export default batch;
