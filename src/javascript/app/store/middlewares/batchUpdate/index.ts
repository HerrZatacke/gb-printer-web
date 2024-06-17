import { Actions } from '../../actions';
import type { MiddlewareWithState } from '../../../../../types/MiddlewareWithState';
import { createUpdateAction } from './createUpdateAction';
import type { ImagesUpdateAction } from '../../../../../types/actions/ImageActions';

const batch: MiddlewareWithState = (store) => (next) => (action) => {

  if (action.type === Actions.UPDATE_IMAGES_BATCH_CHANGES) {
    const updateAction = createUpdateAction(action, store.getState());

    if (updateAction) {
      store.dispatch<ImagesUpdateAction>(updateAction);
    }
  }

  next(action);
};

export default batch;
