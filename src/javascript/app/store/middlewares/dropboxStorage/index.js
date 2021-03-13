import parseAuthParams from '../../../../tools/parseAuthParams';

const dropboxStorage = (store) => {
  let middleware;

  const authParams = parseAuthParams();
  const { use } = store.getState().dropboxStorage;

  if (authParams.accessToken && use) {
    import(/* webpackChunkName: "dmw" */ './middleware')
      .then(({ default: mw }) => {
        middleware = mw(store, { ...authParams, use });
      });
  }

  return (next) => (action) => {
    next(action);

    const storageSettings = store.getState().dropboxStorage;

    if (storageSettings.use) {
      if (
        action.type === 'DROPBOX_SYNC_START' ||
        action.type === 'DROPBOX_START_AUTH'
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
