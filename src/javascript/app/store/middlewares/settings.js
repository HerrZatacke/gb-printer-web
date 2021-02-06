import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';
import getSettings from '../../../tools/getSettings';
import mergeStates from '../../../tools/mergeStates';

const downloadSettings = (what) => {
  const settings = getSettings(what);
  download(null)([{
    blob: new Blob(new Array(settings)),
    filename: `${what}.json`,
  }]);
};

const mergeSettings = (dispatch, state, newSettings) => {
  Object.keys(newSettings).forEach((key) => {
    if (key !== 'state') {
      localStorage.setItem(`gbp-web-${key}`, newSettings[key]);
    }
  });

  dispatch({
    type: 'GLOBAL_UPDATE',
    payload: cleanState(mergeStates(state, newSettings.state)),
  });
};

const settings = (store) => (next) => (action) => {

  switch (action.type) {
    case 'SETTINGS_EXPORT':
      downloadSettings(action.payload);
      break;
    case 'SETTINGS_IMPORT':
      mergeSettings(store.dispatch, store.getState(), action.payload);
      break;
    default:
      break;
  }

  next(action);
};

export default settings;
