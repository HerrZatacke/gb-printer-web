import { Actions } from '../actions';
import { getTrashImages } from '../../../tools/getTrash';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { MonochromeImage } from '../../../../types/Image';
import type { TrashCountImagesAction } from '../../../../types/actions/TrashActions';

const deleteImage: MiddlewareWithState = (store) => {
  const check = async () => {
    store.dispatch<TrashCountImagesAction>({
      type: Actions.SET_TRASH_COUNT_IMAGES,
      payload: (await getTrashImages(store.getState().images as MonochromeImage[])).length,
    });
  };

  check();

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
        check();

        break;
      default:
        break;
    }
  };
};

export default deleteImage;
