import { definitions } from '../../app/store/defaults';

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

  const images = {};
  if (what === 'images') {
    storedImages.forEach((imageHash) => {
      images[imageHash] = localStorage.getItem(`gbp-web-${imageHash}`);
    });
  }

  if (what === 'selected_images') {
    exportableState.images = imageSelection.map((imageHash) => {
      images[imageHash] = localStorage.getItem(`gbp-web-${imageHash}`);
      return exportableState.images.find(({ hash }) => hash === imageHash);
    });
  }

  const frames = {};
  if (what === 'frames') {
    storedFrames.forEach((frameId) => {
      frames[`frame-${frameId}`] = localStorage.getItem(`gbp-web-frame-${frameId}`);
    });
  }

  switch (what) {
    case 'debug':
      return JSON.stringify({ state: localStorageState }, null, 2);
    case 'settings':
    case 'remote':
      return JSON.stringify({ state: exportableState }, null, 2);
    case 'images':
    case 'selected_images':
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
