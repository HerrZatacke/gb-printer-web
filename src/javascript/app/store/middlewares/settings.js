import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';

const getSettings = (what) => {
  const storedImages = Object.keys(localStorage)
    .filter((key) => (key !== 'gbp-web-state' && key.startsWith('gbp-web-')))
    .map((key) => key.replace(/^gbp-web-/gi, ''));

  const state = JSON.parse(localStorage.getItem('gbp-web-state'));
  const images = {};

  switch (what) {
    case 'debug':
      return JSON.stringify({ state }, null, 2);
    case 'settings':
      delete state.images;
      delete state.imageSelection;
      delete state.rgbnImages;
      delete state.activePalette;
      return JSON.stringify({ state }, null, 2);
    case 'full':
      delete state.imageSelection;
      delete state.rgbnImages;
      delete state.activePalette;
      storedImages.forEach((imageHash) => {
        images[imageHash] = localStorage.getItem(`gbp-web-${imageHash}`);
      });
      return JSON.stringify({ state, ...images }, null, 2);
    default:
      return null;
  }
};

const downloadSettings = (what) => {
  const settings = getSettings(what);
  download(null)([{
    blob: new Blob(new Array(settings)),
    arrayBuffer: null,
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
    payload: cleanState({
      ...state,
      ...newSettings.state,
    }),
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
