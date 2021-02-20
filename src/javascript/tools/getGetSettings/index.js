import { definitions } from '../../app/store/defaults';
import getImages from './getImages';
import getFrames from './getFrames';
import getImageHashesForExport from './getImageHashesForExport';

const getGetSettings = (store) => (what) => {

  const state = store.getState();

  const localStorageState = JSON.parse(localStorage.getItem('gbp-web-state'));

  // delete keys potentially containing passwords/tokens
  delete localStorageState.gitStorage;

  const exportableState = {};
  definitions.forEach(({ saveExport, key }) => {
    if (saveExport.includes(what)) {
      exportableState[key] = localStorageState[key];

      if (key === 'images' && what === 'selected_images') {
        exportableState[key] = exportableState[key].filter(({ hash }) => (
          getImageHashesForExport(what, state).includes(hash)
        ));
      }
    }
  });

  switch (what) {
    case 'debug':
      return Promise.resolve(JSON.stringify({ state: localStorageState }, null, 2));
    case 'settings':
    case 'remote':
      return Promise.resolve(JSON.stringify({ state: exportableState }, null, 2));
    case 'images':
    case 'selected_images':
      return getImages(what, getImageHashesForExport(what, state))
        .then((images) => (
          JSON.stringify({
            state: exportableState,
            ...images,
          }, null, 2)
        ));
    case 'frames':
      return getFrames(state.frames)
        .then((frames) => (
          JSON.stringify({
            state: exportableState,
            ...frames,
          }, null, 2)
        ));
    default:
      return null;
  }
};

export default getGetSettings;
