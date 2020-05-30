import { download } from '../../../tools/download';

const getSettings = (what) => {
  const storedImages = Object.keys(localStorage)
    .filter((key) => (key !== 'gbp-web-state' && key.startsWith('gbp-web-')))
    .map((key) => key.replace(/^gbp-web-/gi, ''));

  const settings = JSON.parse(localStorage.getItem('gbp-web-state'));
  const images = {};

  switch (what) {
    case 'debug':
      return JSON.stringify({ settings }, null, 2);
    case 'settings':
      delete settings.images;
      delete settings.imageSelection;
      delete settings.rgbnImages;
      delete settings.activePalette;
      return JSON.stringify({ settings }, null, 2);
    case 'full':
      delete settings.imageSelection;
      delete settings.rgbnImages;
      delete settings.activePalette;
      storedImages.forEach((imageHash) => {
        images[imageHash] = localStorage.getItem(`gbp-web-${imageHash}`);
      });
      return JSON.stringify({ settings, ...images }, null, 2);
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

const settings = () => (next) => (action) => {

  switch (action.type) {
    case 'SETTINGS_EXPORT':
      downloadSettings(action.payload);
      break;
    default:
      break;
  }

  next(action);
};

export default settings;
