import z from 'zod';
import { type BinaryImage, BinaryImageSchema } from '@/types/BinaryImage';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getBinaryImagesByHashes = async (hashes: string[]): Promise<ItemsSourceResponse<BinaryImage>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('binaryimages');
  const total = await store.count();

  const binaryImages = await Promise.all(
    hashes.map(async (hash): Promise<BinaryImage | null> => {
      const imageData = await store.get(hash);
      if (!imageData) {
        return null;
      }

      return { hash, imageData };
    }),
  );

  const filteredBinaryImages = binaryImages.filter((binaryImage): binaryImage is BinaryImage => Boolean(binaryImage));

  const addPaging = getAddPaging<BinaryImage>(total, 0, binaryImages.length, start, BinaryImageSchema);

  return addPaging(filteredBinaryImages);
};

export const getBinaryImageHashes = async (): Promise<ItemsSourceResponse<string>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('binaryimages');
  const binaryImageHashes = await store.getAllKeys();
  const total = await store.count();

  const addPaging = getAddPaging<string>(total, 0, binaryImageHashes.length, start, z.string());

  return addPaging(binaryImageHashes);

};

export const updateBinaryImages = async (binaryImages: BinaryImage[]): Promise<void> => {
  const { success, data: parsedBinaryImages, error } = z.array(BinaryImageSchema).safeParse(binaryImages);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('binaryimages', 'readwrite');
    const store = tx.store;

    await Promise.all(parsedBinaryImages.map((parsedBinaryImage) => store.put(parsedBinaryImage.imageData, parsedBinaryImage.hash)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deleteBinaryImagesByHashes = async (hashes: string[]): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('binaryimages', 'readwrite');
  const store = tx.store;

  await Promise.all(hashes.map((hash) => store.delete(hash)));
  await tx.done;
};

