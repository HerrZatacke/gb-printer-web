import {
  DROPBOX_START_AUTH,
  SET_DROPBOX_STORAGE,
  STORAGE_SYNC_START,
  TRY_RECOVER_IMAGE_DATA,
} from '../../actions';

const dropboxStorage = (store) => {
  let middleware;

  const { dropboxStorage: dropboxStorageData } = store.getState();

  if (dropboxStorageData.use) {
    import(/* webpackChunkName: "dmw" */ './middleware')
      .then(({ default: mw }) => {
        middleware = mw(store);
      });
  }

  return (next) => (action) => {
    next(action);

    const storageSettings = store.getState().dropboxStorage;

    if (storageSettings.use) {
      if (
        action.type === DROPBOX_START_AUTH ||
        action.type === SET_DROPBOX_STORAGE ||
        (
          action.type === STORAGE_SYNC_START &&
          (
            action.payload.storageType === 'dropbox' ||
            action.payload.storageType === 'dropboximages'
          )
        ) ||
        (
          dropboxStorageData.use &&
          action.type === TRY_RECOVER_IMAGE_DATA
        )
      ) {
        if (!middleware) {
          import(/* webpackChunkName: "dmw" */ './middleware')
            .then(({ default: mw }) => {
              // import is async so check for existing mw _again_!!
              middleware = middleware || mw(store);
              middleware(action);
            });
        } else {
          middleware(action);
        }
      }
    }
  };
};

export default dropboxStorage;
