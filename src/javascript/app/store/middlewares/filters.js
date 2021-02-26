import unique from '../../../tools/unique';
import { FILTER_NEW, FILTER_UNTAGGED, FILTER_MONOCHROME, FILTER_RGB } from '../../../consts/specialTags';

const updateAvailableTags = (store) => {
  const state = store.getState();
  store.dispatch({
    type: 'SET_AVAILABLE_TAGS',
    payload: unique(state.images.map(({ tags }) => tags).flat())
      .filter((tag) => (
        ![FILTER_NEW, FILTER_UNTAGGED, FILTER_MONOCHROME, FILTER_RGB].includes(tag)
      )),
  });
};

const filters = (store) => (next) => (action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
    case 'UPDATE_IMAGE':
    case 'UPDATE_IMAGES_BATCH':
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
    case 'GLOBAL_UPDATE':
      next(action);
      updateAvailableTags(store);
      return;

    default:
      break;
  }

  next(action);
};

export default filters;
