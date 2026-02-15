import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import createWrappedInstance from './createWrappedInstance';

const localforageImages = createWrappedInstance<string>({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-images',
}, SheetName.BIN_IMAGES);

const localforageFrames = createWrappedInstance<string>({
  name: 'GB Printer Web',
  storeName: 'gb-printer-web-frames',
}, SheetName.BIN_FRAMES);

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.lfi = localforageImages;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.lff = localforageFrames;
}

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
