import { Actions } from '../../actions';

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
