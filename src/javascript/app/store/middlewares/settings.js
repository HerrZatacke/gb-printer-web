import { download } from '../../../tools/download';
import cleanState from '../../../tools/cleanState';

const getSettings = (what) => {
  const storedImages = Object.keys(localStorage)
    .filter((key) => (
      key !== 'gbp-web-state' &&
      key.startsWith('gbp-web-') &&
      !key.startsWith('gbp-web-frame-')
    ))
    .map((key) => key.replace(/^gbp-web-/gi, ''));

  const storedFrames = Object.keys(localStorage)
    .filter((key) => (key.startsWith('gbp-web-frame-')))
    .map((key) => key.replace(/^gbp-web-frame-/gi, ''));

  const state = JSON.parse(localStorage.getItem('gbp-web-state'));

  const images = {};
  if (what === 'images' || what === 'full') {
    storedImages.forEach((imageHash) => {
      images[imageHash] = localStorage.getItem(`gbp-web-${imageHash}`);
    });
  }

  const frames = {};
  if (what === 'frames' || what === 'full') {
    storedFrames.forEach((frameId) => {
      frames[`frame-${frameId}`] = localStorage.getItem(`gbp-web-frame-${frameId}`);
    });
  }

  switch (what) {
    case 'debug':
      return JSON.stringify({ state }, null, 2);
    case 'settings':
      delete state.images;
      delete state.frames;
      delete state.imageSelection;
      delete state.rgbnImages;
      delete state.activePalette;
      return JSON.stringify({ state }, null, 2);
    case 'images':
      return JSON.stringify({
        state: {
          images: state.images,
        },
        ...images,
      }, null, 2);
    case 'frames':
      return JSON.stringify({
        state: {
          frames: state.frames,
        },
        ...frames,
      }, null, 2);
    case 'full':
      delete state.imageSelection;
      delete state.rgbnImages;
      delete state.activePalette;
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
