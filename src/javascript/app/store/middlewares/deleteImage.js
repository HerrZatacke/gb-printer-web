import { del } from '../../../tools/storage';

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

const deleteFromLocalStorage = (images, deleteHash) => {
  if (
    !hashIsUsedInRGBN(deleteHash, images) &&
    !hashIsUsedInDefault(deleteHash, images)
  ) {
    del(deleteHash);
  }
};

const cleanupLocalStorage = (images) => {
  Object.keys(localStorage)
    .filter((key) => (
      key !== 'gbp-web-state' &&
      key.startsWith('gbp-web-') &&
      !key.startsWith('gbp-web-frame-')
    ))
    .map((key) => key.replace(/^gbp-web-/gi, ''))
    .forEach((hash) => {
      deleteFromLocalStorage(images, hash);
    });
};

const deleteImage = (store) => (next) => (action) => {

  // first delete object data, then do a localStorage cleanup
  next(action);

  switch (action.type) {
    case 'DELETE_IMAGE':
    case 'DELETE_IMAGES':
      cleanupLocalStorage(store.getState().images);
      break;
    default:
      break;
  }
};

export default deleteImage;
