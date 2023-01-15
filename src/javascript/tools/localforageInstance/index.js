import createWrappedInstance from './createWrappedInstance';

const localforageImages = createWrappedInstance({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-images',
});

const localforageFrames = createWrappedInstance({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-frames',
});

window.lfi = localforageImages;
window.lff = localforageFrames;

const localforageReady = async () => {
  await localforageFrames.ready();
  await localforageImages.ready();

  // Wait 5ms until "dummy" item is possibly removed
  await new Promise(((resolve) => {
    window.setTimeout(resolve, 5);
  }));
};

export {
  localforageImages,
  localforageFrames,
  localforageReady,
};
