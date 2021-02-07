// import { init, middleware } from './middleware';

const gitStorage = (store) => {

  let middleware = null;
  let updateClient = null;
  let initialized = false;

  const { gitStorage: gitStorageSettings } = store.getState();

  const {
    use,
    owner,
    repo,
    branch,
    token,
  } = gitStorageSettings;

  if (use && owner && repo && branch && token) {
    import(/* webpackChunkName: "gmw" */ './middleware')
      .then(({ init, updateClient: uc, middleware: mw }) => {
        middleware = mw(store);
        updateClient = uc;
        init(store);
        initialized = true;
      });
  }

  return (next) => (action) => {

    if (action.type === 'SET_GIT_STORAGE') {
      if (!initialized) {
        import(/* webpackChunkName: "gmw" */ './middleware')
          .then(({ init, updateClient: uc, middleware: mw }) => {
            middleware = mw(store);
            updateClient = uc;
            init(store);
            updateClient(action.payload);
            initialized = true;
          });
      } else {
        updateClient(action.payload);
      }
    }

    if (middleware) {
      middleware(action);
    }

    next(action);
  };
};

export default gitStorage;
