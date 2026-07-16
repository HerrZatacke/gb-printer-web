import { getQueryClient } from '@/contexts/QueryClient';
import { framesByHashesQueryOptions } from '@/stores/queries/frames';
import { imagesByAnyHashesQueryOptions } from '@/stores/queries/images';
import { localforageFrames, localforageImages, localforageReady } from '@/tools/localforageInstance';
// import { del, delFrame } from '@/tools/storage';

const isImageDeleted = async (hash: string): Promise<boolean> => {
  const queryClient = getQueryClient();
  const res = await queryClient.fetchQuery(imagesByAnyHashesQueryOptions([hash]));
  const { items: [image] } = res;
  return !image;
};

export const getTrashImages = async (): Promise<string[]> => {
  await localforageReady();
  const storedHashes = await localforageImages.keys();

  const BATCH_SIZE = 150;
  const results: string[] = [];

  for (let i = 0; i < storedHashes.length; i += BATCH_SIZE) {
    const batch = storedHashes.slice(i, i + BATCH_SIZE);
    const deletedFlags = await Promise.all(batch.map((hash) => isImageDeleted(hash)));

    for (let j = 0; j < batch.length; j++) {
      if (deletedFlags[j]) {
        results.push(batch[j]);
      }
    }
  }

  return results;
};

const isFrameDeleted = async (hash: string): Promise<boolean> => {
  const queryClient = getQueryClient();
  const res = await queryClient.fetchQuery(framesByHashesQueryOptions([hash]));
  const { items: [frame] } = res;
  return !frame;
};

export const getTrashFrames = async (): Promise<string[]> => {
  await localforageReady();
  const storedHashes = await localforageFrames.keys();

  const BATCH_SIZE = 50;
  const results: string[] = [];

  const candidates = storedHashes.filter((hash) => !hash.startsWith('dummy'));


  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const deletedFlags = await Promise.all(batch.map((hash) => isFrameDeleted(hash)));

    for (let j = 0; j < batch.length; j++) {
      if (deletedFlags[j]) {
        results.push(batch[j]);
      }
    }
  }

  return results;
};

export const cleanupStorage = async (): Promise<void> => {
  const trashImages = await getTrashImages();
  const trashFrames = await getTrashFrames();

  alert('ToDo: check cleanup result'); // ToDo: Check the result. Including hashes used only in rgbn images, moni images, both etc...
  console.log(trashImages, trashFrames);

  // await Promise.all([
  //   ...trashFrames.map((deleteHash) => delFrame(deleteHash)),
  //   ...trashImages.map((deleteHash) => del(deleteHash)),
  // ]);
};
