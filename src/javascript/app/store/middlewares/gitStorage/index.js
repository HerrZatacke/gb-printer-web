const gitStorage = (store) => {

  let middleware = null;

  return (next) => (action) => {

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

    next(action);
  };
};

export default gitStorage;
