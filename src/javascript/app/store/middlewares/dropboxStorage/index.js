import { Dropbox } from 'dropbox';
import parseAuthParams from '../../../../tools/parseAuthParams';

const dropboxStorage = (store) => {
  const tokens = {
    ...store.getState().dropboxTokens,
    ...parseAuthParams(),
  };

  let middleware;

  if (tokens.accessToken) {
    import(/* webpackChunkName: "dmw" */ './middleware')
      .then(({ default: mw }) => {
        middleware = mw(store, tokens);
      });
  }

  return (next) => (action) => {
    next(action);

    switch (action.type) {
      case 'DROPBOX_SYNC_START':
        middleware(action);

        break;
      case 'DROPBOX_START_AUTH': {
        // ToDo: danymic import
        const dbx = new Dropbox({
          clientId: DROPBOX_APP_KEY,
        });
        dbx.auth.getAuthenticationUrl(encodeURIComponent(`${window.location.protocol}//${window.location.host}/`))
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
