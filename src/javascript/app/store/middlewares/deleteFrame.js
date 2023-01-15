import { delFrame } from '../../../tools/storage';
import { localforageFrames, localforageReady } from '../../../tools/localforageInstance';
import { DELETE_FRAME } from '../actions';

const frameIsUsed = (hash, frames) => (
  !!frames.find((frame) => frame.hash === hash)
);

const deleteFromStorage = (frames) => (deleteHash) => {
  if (!frameIsUsed(deleteHash, frames)) {
    delFrame(deleteHash);
  }
};

const cleanupStorage = async (frames) => {
  await localforageReady();
  const storedHashes = await localforageFrames.keys();
  storedHashes.forEach(deleteFromStorage(frames));
};

const deleteImage = (store) => (next) => (action) => {

  // first delete object data, then do a localStorage cleanup
  next(action);

  switch (action.type) {
    case DELETE_FRAME:
      cleanupStorage(store.getState().frames);
      break;
    default:
      break;
  }
};

export default deleteImage;
