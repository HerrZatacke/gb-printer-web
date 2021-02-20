import { localforageImages, localforageFrames } from '../localforageInstance';

const transferLocalStorage = () => (
  new Promise(((resolve) => {

    // Migrate Frames
    Object.keys(localStorage)
      .filter((key) => (
        key.startsWith('gbp-web-frame-')
      ))
      .map((key) => ({
        key,
        newKey: key.replace(/^gbp-web-frame-/gi, ''),
      }))
      .forEach(({ key, newKey }) => {
        localforageFrames.setItem(newKey, localStorage.getItem(key));
        localStorage.removeItem(key);
      });

    // Migrate Images
    Object.keys(localStorage)
      .filter((key) => (
        key !== 'gbp-web-state' &&
        key !== 'gbp-web-theme' &&
        key.startsWith('gbp-web-') &&
        !key.startsWith('gbp-web-frame-')
      ))
      .map((key) => ({
        key,
        newKey: key.replace(/^gbp-web-/gi, ''),
      }))
      .forEach(({ key, newKey }) => {
        localforageImages.setItem(newKey, localStorage.getItem(key));
        localStorage.removeItem(key);
      });
    resolve();
  }))
);

export default transferLocalStorage;
