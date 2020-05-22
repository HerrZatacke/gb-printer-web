import { del } from '../../../tools/storage';

const hashIsUsedInRGBN = (hash, otherImages) => (
  !!otherImages.find(({ hashes }) => {
    if (!hashes) {
      return false;
    }

    const { r, g, b, n } = hashes;
    return [r, g, b, n].includes(hash);
  })
);

const hashIsUsedInDefault = (hash, otherImages) => (
  !!otherImages.find((image) => image.hash === hash)
);

const deleteImage = (store) => (next) => (action) => {

  if (action.type === 'DELETE_IMAGE') {

    const state = store.getState();

    const toDelete = state.images.find(({ hash }) => hash === action.payload);
    const deleteType = toDelete.hashes ? 'rgbn' : 'default';
    const otherImages = state.images.filter(({ hash }) => hash !== toDelete.hash);

    // Find RGBN images that contain the hash of the default image to be deleted
    if (deleteType === 'default') {
      // if the hash is not used in an rgbn image, remove it from localStorage
      if (!hashIsUsedInRGBN(toDelete.hash, otherImages)) {
        del(toDelete.hash);
      }
    }

    // cleanup if r,g,b,n, hashes are not used elsewhere
    if (deleteType === 'rgbn') {
      const { r, g, b, n } = toDelete.hashes;
      [r, g, b, n].filter(Boolean).forEach((partHash) => {
        if (
          !hashIsUsedInRGBN(partHash, otherImages) &&
          !hashIsUsedInDefault(partHash, otherImages)
        ) {
          del(partHash);
        }
      });
    }
  }

  next(action);
};

export default deleteImage;
