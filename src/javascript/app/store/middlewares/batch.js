import getFilteredImages from '../../../tools/getFilteredImages';

const batch = (store) => (next) => (action) => {

  if (action.type === 'IMAGE_SELECTION_SHIFTCLICK') {
    const state = store.getState();
    const images = getFilteredImages(state);
    const { lastSelectedImage } = state;
    const selectedIndex = images.findIndex(({ hash }) => hash === action.payload);
    const prevSelectedIndex = Math.max(0, images.findIndex(({ hash }) => hash === lastSelectedImage));

    const from = Math.min(prevSelectedIndex, selectedIndex);
    const to = Math.max(prevSelectedIndex, selectedIndex);

    store.dispatch({
      type: 'IMAGE_SELECTION_SET',
      payload: images.slice(from, to + 1).map(({ hash }) => hash),
    });
  }

  if (action.type === 'BATCH_TASK') {
    const { imageSelection } = store.getState();

    if (imageSelection.length) {
      switch (action.payload) {
        case 'delete':
          store.dispatch({
            type: 'DELETE_IMAGES',
            payload: imageSelection,
          });
          break;
        case 'download':
          // eslint-disable-next-line no-alert
          alert('Not yet...');
          break;
        case 'edit':
          // eslint-disable-next-line no-alert
          alert('Not yet...');
          break;
        default:
          break;
      }
    }
  }

  next(action);
};

export default batch;
