import localforage from 'localforage';

const localforageImages = localforage.createInstance({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-images',
});

const localforageFrames = localforage.createInstance({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-frames',
});

window.lfi = localforageImages;
window.lff = localforageFrames;

export {
  localforageImages,
  localforageFrames,
};
