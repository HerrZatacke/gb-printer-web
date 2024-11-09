import type { AnyAction } from 'redux';
import useStoragesStore from '../../../stores/storagesStore';
import { Actions } from '../../actions';
import type { MiddlewareWithState } from '../../../../../types/MiddlewareWithState';

const gitStorage: MiddlewareWithState = (store) => {

  let middleware: (action: AnyAction) => Promise<void>;

  return (next) => async (action) => {

    next(action);

    const { gitStorage: gitStorageSettings } = useStoragesStore.getState();

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
          init();
          middleware = mw(store);
        }

        middleware(action);
      }
    }

  };
};

export default gitStorage;
