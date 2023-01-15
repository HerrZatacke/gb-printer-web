import { del } from '../../../tools/storage';
import { localforageImages, localforageReady } from '../../../tools/localforageInstance';
import { DELETE_IMAGE, DELETE_IMAGES } from '../actions';

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

const deleteFromStorage = (images) => (deleteHash) => {
  if (
    !hashIsUsedInRGBN(deleteHash, images) &&
    !hashIsUsedInDefault(deleteHash, images)
  ) {
    del(deleteHash);
  }
};

const cleanupStorage = async (images) => {
  await localforageReady();
  const storedHashes = await localforageImages.keys();
  storedHashes.forEach(deleteFromStorage(images));
};

const deleteImage = (store) => (next) => (action) => {

  // first delete object data, then do a localStorage cleanup
  next(action);

  switch (action.type) {
    case DELETE_IMAGE:
    case DELETE_IMAGES:
      cleanupStorage(store.getState().images);
      break;
    default:
      break;
  }
};

export default deleteImage;
