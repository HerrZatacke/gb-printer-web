import { localforageFrames, localforageImages, localforageReady } from '../localforageInstance';
import { del, delFrame } from '../storage';

const hashIsUsedInRGBN = (hash, images) => (
  !!images.find(({ hashes }) => {
    if (!hashes) {
      return false;
    }

    const { r, g, b, n } = hashes;
    return [r, g, b, n].includes(hash);
  })
);

const hashIsUsedInDefault = (hash, images) => (
  !!images.find((image) => image.hash === hash)
);

const imageIsDeleted = (images) => (deleteHash) => (
  !hashIsUsedInRGBN(deleteHash, images) &&
  !hashIsUsedInDefault(deleteHash, images)
);

const frameIsUsed = (hash, frames) => (
  !!frames.find((frame) => frame.hash === hash)
);

const deleteFrameFromStorage = (frames) => (deleteHash) => {
  if (!frameIsUsed(deleteHash, frames)) {
    delFrame(deleteHash);
  }
};

const deleteImageFromStorage = (images) => (deleteHash) => {
  if (
    !hashIsUsedInRGBN(deleteHash, images) &&
    !hashIsUsedInDefault(deleteHash, images)
  ) {
    del(deleteHash);
  }
};

export const cleanupStorage = async ({
  images,
  frames,
}) => {
  await localforageReady();
  const storedImages = await localforageImages.keys();
  storedImages.forEach(deleteImageFromStorage(images));

  const storedFrames = await localforageFrames.keys();
  storedFrames.forEach(deleteFrameFromStorage(frames));
};


export const getTrashImages = async (images) => {
  await localforageReady();
  const storedHashes = await localforageImages.keys();
  return storedHashes
    .filter((hash) => !hash.startsWith('dummy'))
    .filter(imageIsDeleted(images));
};

const frameIsDeleted = (frames) => (hash) => (
  !frames.find((frame) => frame.hash === hash)
);

export const getTrashFrames = async (frames) => {
  await localforageReady();
  const storedHashes = await localforageFrames.keys();
  return storedHashes
    .filter((hash) => !hash.startsWith('dummy'))
    .filter(frameIsDeleted(frames));
};
