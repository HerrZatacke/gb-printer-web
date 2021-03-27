const dropboxStorage = (store) => {
  let middleware;

  const { dropboxStorage: dropboxStorageData } = store.getState();

  if (dropboxStorageData.use) {
    import(/* webpackChunkName: "dmw" */ './middleware')
      .then(({ default: mw }) => {
        middleware = mw(store, dropboxStorageData);
      });
  }

  return (next) => (action) => {
    next(action);

    const storageSettings = store.getState().dropboxStorage;

    if (storageSettings.use) {
      if (
        action.type === 'DROPBOX_START_AUTH' ||
        (
          action.type === 'STORAGE_SYNC_START' &&
          action.payload.storageType === 'dropbox'
        )
      ) {
        if (!middleware) {
          import(/* webpackChunkName: "dmw" */ './middleware')
            .then(({ default: mw }) => {
              middleware = mw(store, storageSettings);
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
