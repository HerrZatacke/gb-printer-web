const gitStorage = (store) => {

  let middleware = null;

  return (next) => (action) => {

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
        action.type === 'SET_GIT_STORAGE' ||
        action.type === 'GITSTORAGE_SYNC_START'
      ) {

        if (!middleware) {
          import(/* webpackChunkName: "gmw" */ './middleware')
            .then(({ init, middleware: mw }) => {
              init(store);
              middleware = mw(store);
              middleware(action);
            });
        } else {
          middleware(action);
        }
      }
    }

  };
};

export default gitStorage;
