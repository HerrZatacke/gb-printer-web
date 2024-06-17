import { localforageFrames, localforageImages, localforageReady } from '../localforageInstance';
import { del, delFrame } from '../storage';
import { MonochromeImage, RGBNImage, Image } from '../../../types/Image';

interface CheckFrame {
  hash: string,
}

const hashIsUsedInRGBN = (hash: string, images: RGBNImage[]): boolean => (
  !!images.find(({ hashes }) => {
    if (!hashes) {
      return false;
    }

    return Object.values(hashes).includes(hash);
  })
);

const hashIsUsedInMonochrome = (hash: string, images: MonochromeImage[]): boolean => (
  !!images.find((image) => image.hash === hash)
);

const imageIsDeleted = (images: Image[]) => (deleteHash: string): boolean => (
  !hashIsUsedInRGBN(deleteHash, images as RGBNImage[]) &&
  !hashIsUsedInMonochrome(deleteHash, images as MonochromeImage[])
);

const frameIsUsed = (hash: string, frames: CheckFrame[]): boolean => (
  !!frames.find((frame) => frame.hash === hash)
);

const deleteFrameFromStorage = (frames: CheckFrame[]) => (deleteHash: string): void => {
  if (!frameIsUsed(deleteHash, frames)) {
    delFrame(deleteHash);
  }
};

const deleteImageFromStorage = (images: Image[]) => (deleteHash: string): void => {
  if (
    !hashIsUsedInRGBN(deleteHash, images as RGBNImage[]) &&
    !hashIsUsedInMonochrome(deleteHash, images as MonochromeImage[])
  ) {
    del(deleteHash);
  }
};

export const cleanupStorage = async ({
  images,
  frames,
}: {
  images: Image[]
  frames: CheckFrame[],
}): Promise<void> => {
  await localforageReady();
  const storedImages = await localforageImages.keys();
  storedImages.forEach(deleteImageFromStorage(images));

  const storedFrames = await localforageFrames.keys();
  storedFrames.forEach(deleteFrameFromStorage(frames));
};


export const getTrashImages = async (images: MonochromeImage[]): Promise<string[]> => {
  await localforageReady();
  const storedHashes = await localforageImages.keys();
  return storedHashes
    .filter((hash) => !hash.startsWith('dummy'))
    .filter(imageIsDeleted(images));
};

const frameIsDeleted = (frames: CheckFrame[]) => (hash: string): boolean => (
  !frames.find((frame) => frame.hash === hash)
);

export const getTrashFrames = async (frames: CheckFrame[]): Promise<string[]> => {
  await localforageReady();
  const storedHashes = await localforageFrames.keys();
  return storedHashes
    .filter((hash) => !hash.startsWith('dummy'))
    .filter(frameIsDeleted(frames));
};
