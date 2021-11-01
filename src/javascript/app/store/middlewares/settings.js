import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';
import getGetSettings from '../../../tools/getGetSettings';
import mergeStates from '../../../tools/mergeStates';
import { localforageFrames, localforageImages } from '../../../tools/localforageInstance';
import { DROPBOX_SETTINGS_IMPORT, GIT_SETTINGS_IMPORT, GLOBAL_UPDATE, JSON_EXPORT, JSON_IMPORT } from '../actions';

const mergeSettings = (dispatch, state, newSettings, mergeImagesFrames = false) => {
  Object.keys(newSettings).forEach((key) => {
    if (key !== 'state') {
      if (key.match(/^[a-f0-9]{40}$/gi)) {
        localforageImages.setItem(`${key}`, newSettings[key]);
      } else if (key.startsWith('frame-')) {
        localforageFrames.setItem(`${key.split('frame-').pop()}`, newSettings[key]);
      }
    }
  });

  dispatch({
    type: GLOBAL_UPDATE,
    payload: cleanState(mergeStates(state, newSettings.state || {}, mergeImagesFrames)),
  });
};

const settings = (store) => {
  const getSettings = getGetSettings(store);

  const downloadSettings = (what) => {
    getSettings(what)
      .then((currentSettings) => {
        download(null)([{
          blob: new Blob(new Array(currentSettings)),
          filename: `${what}.json`,
        }]);
      });
  };

  return (next) => (action) => {
    switch (action.type) {
      case JSON_EXPORT:
        downloadSettings(action.payload);
        break;
      case JSON_IMPORT:
        mergeSettings(store.dispatch, store.getState(), action.payload, true);
        break;
      case GIT_SETTINGS_IMPORT:
      case DROPBOX_SETTINGS_IMPORT:
        mergeSettings(store.dispatch, store.getState(), action.payload, false);
        break;
      default:
        break;
    }

    next(action);
  };
};

export default settings;
