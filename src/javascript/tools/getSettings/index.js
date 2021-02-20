import { definitions } from '../../app/store/defaults';
import getImages from './getImages';
import getFrames from './getFrames';

const getSettings = (what, imageSelection = []) => {
  const storedImages = Object.keys(localStorage)
    .filter((key) => (
      key !== 'gbp-web-state' &&
      key !== 'gbp-web-theme' &&
      key.startsWith('gbp-web-') &&
      !key.startsWith('gbp-web-frame-')
    ))
    .map((key) => key.replace(/^gbp-web-/gi, ''));

  const storedFrames = Object.keys(localStorage)
    .filter((key) => (key.startsWith('gbp-web-frame-')))
    .map((key) => key.replace(/^gbp-web-frame-/gi, ''));

  const localStorageState = JSON.parse(localStorage.getItem('gbp-web-state'));

  // delete keys potentially containing passwords/tokens
  delete localStorageState.gitStorage;

  const exportableState = {};
  definitions.forEach(({ saveExport, key }) => {
    if (saveExport.includes(what)) {
      exportableState[key] = localStorageState[key];
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
      return getImages(storedImages)
        .then((images) => (
          JSON.stringify({
            state: exportableState,
            ...images,
          }, null, 2)
        ));
    case 'frames':
      return getFrames(storedFrames)
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

export default getSettings;
