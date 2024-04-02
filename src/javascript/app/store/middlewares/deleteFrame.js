import { Actions } from '../actions';
import { getTrashFrames } from '../../../tools/getTrash';

const deleteImage = (store) => {
  (async () => {
    store.dispatch({
      type: Actions.SET_TRASH_COUNT_FRAMES,
      payload: (await getTrashFrames(store.getState().frames)).length,
    });
  })();

  return (next) => (action) => {

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case Actions.DELETE_FRAME:
      case Actions.ADD_FRAME:
      case Actions.GLOBAL_UPDATE:
      case Actions.UPDATE_TRASH_COUNT:
        (async () => {
          store.dispatch({
            type: Actions.SET_TRASH_COUNT_FRAMES,
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
