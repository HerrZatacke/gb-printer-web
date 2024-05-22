import getFilteredImages from '../../../tools/getFilteredImages';
import unique from '../../../tools/unique';
import { Actions } from '../actions';

const collectTags = (batchImages) => (
  unique(batchImages.map(({ tags }) => tags).flat())
);

const batch = (store) => (next) => (action) => {

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
    const batchImages = images.filter(({ hash }) => imageSelection.includes(hash));

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
                });
              },
              deny: () => {
                store.dispatch({
                  type: Actions.CONFIRM_ANSWERED,
                });
              },
            },
          });

          break;
        }

        case 'animate':
          store.dispatch({
            type: Actions.SET_VIDEO_PARAMS,
            payload: {
              imageSelection,
            },
          });
          break;
        case 'download':
          store.dispatch({
            type: Actions.DOWNLOAD_SELECTION,
            payload: imageSelection,
          });
          break;
        case 'edit':
          store.dispatch({
            type: Actions.EDIT_IMAGE_SELECTION,
            payload: {
              hash: batchImages[0].hash,
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
      case 'checkall':
        store.dispatch({
          type: Actions.IMAGE_SELECTION_SET,
          payload: getFilteredImages(state)
            .slice(action.page * pageSize, (action.page + 1) * pageSize || undefined)
            .map(({ hash }) => hash),
        });
        break;

      case 'uncheckall':
        store.dispatch({
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
