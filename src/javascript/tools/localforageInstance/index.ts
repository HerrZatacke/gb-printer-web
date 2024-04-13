import createWrappedInstance from './createWrappedInstance';

const localforageImages = createWrappedInstance<Uint8Array>({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-images',
});

const localforageFrames = createWrappedInstance<Uint8Array>({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-frames',
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.lfi = localforageImages;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.lff = localforageFrames;

const localforageReady = async (): Promise<void> => {
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
