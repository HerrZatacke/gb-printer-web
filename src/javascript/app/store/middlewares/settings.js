import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';
import getGetSettings from '../../../tools/getGetSettings';
import mergeStates from '../../../tools/mergeStates';
import { localforageFrames, localforageImages } from '../../../tools/localforageInstance';
import { Actions } from '../actions';

const mergeSettings = (dispatch, state, newSettings, mergeImagesFrames = false) => {
  Object.keys(newSettings).forEach((key) => {
    if (key !== 'state') {
      if (key.match(/^[a-f0-9]{40,}$/gi)) {
        localforageImages.setItem(`${key}`, newSettings[key]);
      } else if (key.startsWith('frame-')) {
        localforageFrames.setItem(`${key.split('frame-').pop()}`, newSettings[key]);
      }
    }
  });

  cleanState(mergeStates(state, newSettings.state || {}, mergeImagesFrames))
    .then((cleanedState) => {
      dispatch({
        type: Actions.GLOBAL_UPDATE,
        payload: cleanedState,
      });
    });
};

const settings = (store) => {
  const getSettings = getGetSettings(store);

  const downloadSettings = (what, selectedFrameGroup = '') => {
    getSettings(what, { selectedFrameGroup })
      .then((currentSettings) => {
        const filename = what === 'frames' ? 'frames' : [what, selectedFrameGroup].filter(Boolean).join('_');

        download(null)([{
          blob: new Blob(new Array(currentSettings)),
          filename: `${filename}.json`,
        }]);
      });
  };

  return (next) => (action) => {
    switch (action.type) {
      case Actions.JSON_EXPORT:
        downloadSettings(action.payload, action.selectedFrameGroup);
        break;
      case Actions.JSON_IMPORT:
        mergeSettings(store.dispatch, store.getState(), action.payload, true);
        break;
      case Actions.GIT_SETTINGS_IMPORT:
      case Actions.DROPBOX_SETTINGS_IMPORT:
        mergeSettings(store.dispatch, store.getState(), action.payload, false);
        break;
      default:
        break;
    }

    next(action);
  };
};

export default settings;
