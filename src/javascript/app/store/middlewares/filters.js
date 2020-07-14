import uniqe from '../../../tools/unique';

const updateAvailableTags = (store) => {
  const state = store.getState();
  store.dispatch({
    type: 'SET_AVAILABLE_TAGS',
    payload: uniqe(state.images.map(({ tags }) => tags).flat()),
  });
};

const filters = (store) => (next) => (action) => {


  switch (action.type) {
    case 'ADD_IMAGE':
    case 'UPDATE_IMAGE':
    case 'UPDATE_IMAGES_BATCH':
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
      next(action);
      updateAvailableTags(store);
      return;

    default:
      break;
  }

  next(action);
};

export default filters;
