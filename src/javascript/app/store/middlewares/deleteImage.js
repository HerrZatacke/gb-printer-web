import {
  ADD_IMAGES,
  DELETE_IMAGE,
  DELETE_IMAGES,
  GLOBAL_UPDATE,
  REHASH_IMAGE,
  SET_TRASH_COUNT_IMAGES,
  UPDATE_TRASH_COUNT,
} from '../actions';
import { getTrashImages } from '../../../tools/getTrash';

const deleteImage = (store) => {
  (async () => {
    store.dispatch({
      type: SET_TRASH_COUNT_IMAGES,
      payload: (await getTrashImages(store.getState().images)).length,
    });
  })();

  return (next) => (action) => {

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case DELETE_IMAGE:
      case DELETE_IMAGES:
      case ADD_IMAGES:
      case GLOBAL_UPDATE:
      case REHASH_IMAGE:
      case UPDATE_TRASH_COUNT:
        (async () => {
          store.dispatch({
            type: SET_TRASH_COUNT_IMAGES,
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
