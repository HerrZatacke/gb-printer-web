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

const localforageReady = () => (
  localforageFrames.ready()
    .then(() => (
      localforageImages.ready()
    ))
);

export {
  localforageImages,
  localforageFrames,
  localforageReady,
};
