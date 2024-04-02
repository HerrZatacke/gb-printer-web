import { Actions } from '../actions';
import { getTrashImages } from '../../../tools/getTrash';

const deleteImage = (store) => {
  (async () => {
    store.dispatch({
      type: Actions.SET_TRASH_COUNT_IMAGES,
      payload: (await getTrashImages(store.getState().images)).length,
    });
  })();

  return (next) => (action) => {

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case Actions.DELETE_IMAGE:
      case Actions.DELETE_IMAGES:
      case Actions.ADD_IMAGES:
      case Actions.GLOBAL_UPDATE:
      case Actions.REHASH_IMAGE:
      case Actions.UPDATE_TRASH_COUNT:
        (async () => {
          store.dispatch({
            type: Actions.SET_TRASH_COUNT_IMAGES,
            payload: (await getTrashImages(store.getState().images)).length,
          });
        })();

        break;
      default:
        break;
    }
  };
};

export default deleteImage;
