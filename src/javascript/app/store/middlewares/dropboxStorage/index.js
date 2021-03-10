import { Dropbox } from 'dropbox';

const dropboxStorage = (store) => {
  const { dropboxToken } = store.getState();

  let middleware;

  if (dropboxToken) {
    import(/* webpackChunkName: "gmw" */ './middleware')
      .then(({ init, middleware: mw }) => {
        init(store);
        middleware = mw(store);
      });
  }

  return (next) => (action) => {
    next(action);

    switch (action.type) {
      case 'DROPBOX_SYNC_START':
        if (dropboxToken) {
          middleware(action);
        }

        break;
      case 'DROPBOX_START_AUTH': {
        // ToDo: danymic import
        const dbx = new Dropbox({
          clientId: DROPBOX_APP_KEY,
        });
        dbx.auth.getAuthenticationUrl(encodeURIComponent(`${window.location.protocol}//${window.location.host}/`), 'dropbox')
          .then((authUrl) => {
            window.location.replace(authUrl);
          });
        break;
      }

      default:
        break;
    }
  };
};

export default dropboxStorage;