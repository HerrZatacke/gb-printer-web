import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';
import getSettings from '../../../tools/getSettings';
import mergeStates from '../../../tools/mergeStates';

const downloadSettings = (what, imageSelection) => {
  const settings = getSettings(what, imageSelection);
  download(null)([{
    blob: new Blob(new Array(settings)),
    filename: `${what}.json`,
  }]);
};

const mergeSettings = (dispatch, state, newSettings, mergeImagesFrames = false) => {
  Object.keys(newSettings).forEach((key) => {
    if (key !== 'state') {
      localStorage.setItem(`gbp-web-${key}`, newSettings[key]);
    }
  });

  dispatch({
    type: 'GLOBAL_UPDATE',
    payload: cleanState(mergeStates(state, newSettings.state || {}, mergeImagesFrames)),
  });
};

const settings = (store) => (next) => (action) => {

  switch (action.type) {
    case 'JSON_EXPORT':
      downloadSettings(action.payload, store.getState().imageSelection);
      break;
    case 'JSON_IMPORT':
      mergeSettings(store.dispatch, store.getState(), action.payload, true);
      break;
    case 'GIT_SETTINGS_IMPORT':
      mergeSettings(store.dispatch, store.getState(), action.payload, false);
      break;
    default:
      break;
  }

  next(action);
};

export default settings;
