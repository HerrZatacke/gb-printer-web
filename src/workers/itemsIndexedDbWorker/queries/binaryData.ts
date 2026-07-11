import { getDb } from '@/workers/itemsIndexedDbWorker/db';

export const getFrameDataByHashes = async (hashes: string[]): Promise<string[]> => {
  const db = await getDb();
  const { store } = db.transaction('binaryframes');

  const frameDatas = await Promise.all(
    hashes.map(hash => store.get(hash)),
  );

  return frameDatas.filter((frame): frame is string => Boolean(frame));
};

export const getImageDataByHashes = async (hashes: string[]): Promise<string[]> => {
  const db = await getDb();
  const { store } = db.transaction('binaryimages');

  const imageDatas = await Promise.all(
    hashes.map(hash => store.get(hash)),
  );

  return imageDatas.filter((image): image is string => Boolean(image));
};
