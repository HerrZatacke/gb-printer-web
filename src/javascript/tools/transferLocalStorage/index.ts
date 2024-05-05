import { localforageImages, localforageFrames } from '../localforageInstance';

const transferLocalStorage = (): Promise<void> => (
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
        const data = localStorage.getItem(key);
        if (data) {
          localforageFrames.setItem(newKey, data);
          localStorage.removeItem(key);
        }
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
        const data = localStorage.getItem(key);
        if (data) {
          localforageImages.setItem(newKey, data);
          localStorage.removeItem(key);
        }
      });

    resolve();
  }))
);

export default transferLocalStorage;
