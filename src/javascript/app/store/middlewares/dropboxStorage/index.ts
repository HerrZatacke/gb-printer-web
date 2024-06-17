import type { AnyAction } from 'redux';
import { Actions } from '../../actions';
import type { MiddlewareWithState } from '../../../../../types/MiddlewareWithState';

const dropboxStorage: MiddlewareWithState = (store) => {
  let middleware: (action: AnyAction) => Promise<void>;
  const { dropboxStorage: dropboxStorageData } = store.getState();

  const loadAndInitMiddleware = async (action?: AnyAction) => {
    const { default: mw } = await import(/* webpackChunkName: "dmw" */ './middleware');
    middleware = middleware || mw(store);
    if (action) {
      middleware(action);
    }
  };

  if (dropboxStorageData.use) {
    loadAndInitMiddleware();
  }

  return (next) => (action) => {
    next(action);

    const storageSettings = store.getState().dropboxStorage;

    if (storageSettings.use) {
      if (
        action.type === Actions.DROPBOX_START_AUTH ||
        action.type === Actions.SET_DROPBOX_STORAGE ||
        (
          action.type === Actions.STORAGE_SYNC_START &&
          (
            action.payload.storageType === 'dropbox' ||
            action.payload.storageType === 'dropboximages'
          )
        ) ||
        (
          dropboxStorageData.use &&
          action.type === Actions.TRY_RECOVER_IMAGE_DATA
        )
      ) {
        if (!middleware) {
          loadAndInitMiddleware(action);
        } else {
          middleware(action);
        }
      }
    }
  };
};

export default dropboxStorage;
