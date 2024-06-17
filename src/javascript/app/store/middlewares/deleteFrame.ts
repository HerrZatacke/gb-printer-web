import { Actions } from '../actions';
import { getTrashFrames } from '../../../tools/getTrash';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { TrashCountFramesAction } from '../../../../types/actions/TrashActions';

const deleteImage: MiddlewareWithState = (store) => {
  const check = async () => {
    store.dispatch<TrashCountFramesAction>({
      type: Actions.SET_TRASH_COUNT_FRAMES,
      payload: (await getTrashFrames(store.getState().frames)).length,
    });
  };

  check();

  return (next) => (action) => {

    // first delete object data, then do a localStorage cleanup
    next(action);

    switch (action.type) {
      case Actions.DELETE_FRAME:
      case Actions.ADD_FRAME:
      case Actions.GLOBAL_UPDATE:
      case Actions.UPDATE_TRASH_COUNT:
        check();

        break;
      default:
        break;
    }
  };
};

export default deleteImage;
