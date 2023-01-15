import {
  ADD_FRAME,
  DELETE_FRAME,
  GLOBAL_UPDATE,
  SET_TRASH_COUNT_FRAMES,
  UPDATE_TRASH_COUNT,
} from '../actions';
import { getTrashFrames } from '../../../tools/getTrash';

const deleteImage = (store) => {
  (async () => {
    store.dispatch({
      type: SET_TRASH_COUNT_FRAMES,
      payload: (await getTrashFrames(store.getState().frames)).length,
    });
  })();

  return (next) => (action) => {

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case DELETE_FRAME:
      case ADD_FRAME:
      case GLOBAL_UPDATE:
      case UPDATE_TRASH_COUNT:
        (async () => {
          store.dispatch({
            type: SET_TRASH_COUNT_FRAMES,
            payload: (await getTrashFrames(store.getState().frames)).length,
          });
        })();

        break;
      default:
        break;
    }
  };
};

export default deleteImage;
