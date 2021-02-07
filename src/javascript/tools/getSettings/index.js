import { definitions } from '../../app/store/defaults';

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

  const localStorageState = JSON.parse(localStorage.getItem('gbp-web-state'));

  // delete keys potentially containing passwords/tokens
  delete localStorageState.gitStorage;

  const images = {};
  if (what === 'images') {
    storedImages.forEach((imageHash) => {
      images[imageHash] = localStorage.getItem(`gbp-web-${imageHash}`);
    });
  }

  const frames = {};
  if (what === 'frames') {
    storedFrames.forEach((frameId) => {
      frames[`frame-${frameId}`] = localStorage.getItem(`gbp-web-frame-${frameId}`);
    });
  }

  const exportableState = {};
  definitions.forEach(({ saveExport, key }) => {
    if (saveExport.includes(what)) {
      exportableState[key] = localStorageState[key];
    }
  });

  switch (what) {
    case 'debug':
      return JSON.stringify({ state: localStorageState }, null, 2);
    case 'settings':
    case 'remote':
      return JSON.stringify({ state: exportableState }, null, 2);
    case 'images':
      return JSON.stringify({
        state: exportableState,
        ...images,
      }, null, 2);
    case 'frames':
      return JSON.stringify({
        state: exportableState,
        ...frames,
      }, null, 2);
    default:
      return null;
  }
};

export default getSettings;
