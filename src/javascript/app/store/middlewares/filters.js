import uniqe from '../../../tools/unique';

const filters = (store) => (next) => (action) => {

  const state = store.getState();

  switch (action.type) {
    case 'SHOW_FILTERS':
      next({
        ...action,
        payload: uniqe(state.images.map(({ tags }) => tags).flat())
          .sort(),
      });
      return;

    case 'UPDATE_IMAGE':
      next({
        ...action,
        activeTags: uniqe(state.images.map(({ tags }) => tags).flat())
          .filter((tag) => state.filter.activeTags.includes(tag)),
      });
      return;

    default:
      break;
  }

  next(action);
};

export default filters;
