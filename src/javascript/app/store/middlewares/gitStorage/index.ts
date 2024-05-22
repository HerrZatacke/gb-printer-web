import { AnyAction } from 'redux';
import { Actions } from '../../actions';
import { MiddlewareWithState } from '../../../../../types/MiddlewareWithState';

const gitStorage: MiddlewareWithState = (store) => {

  let middleware: (action: AnyAction) => Promise<void>;

  return (next) => async (action) => {

    next(action);

    const { gitStorage: gitStorageSettings } = store.getState();

    const {
      use,
      owner,
      repo,
      branch,
      token,
    } = gitStorageSettings;

    if (use && owner && repo && branch && token) {
      if (
        action.type === Actions.SET_GIT_STORAGE ||
        (
          action.type === Actions.STORAGE_SYNC_START &&
          action.payload.storageType === 'git'
        )
      ) {

        if (!middleware) {
          const { init, middleware: mw } = await import(/* webpackChunkName: "gmw" */ './middleware');
          init(store);
          middleware = mw(store);
        }

        middleware(action);
      }
    }

  };
};

export default gitStorage;
