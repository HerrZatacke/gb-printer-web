import { type IDBPDatabase } from 'idb';
import {
  type ItemsDB,
  type StoredImage,
} from '@/workers/itemsIndexedDbWorker/types';

export const resolveAndFilterImages = async (
  db: IDBPDatabase<ItemsDB>,
  matches?: (item: StoredImage) => boolean,
  seedIds?: Set<string>,
): Promise<StoredImage[]> => {
  if (!matches && !seedIds) {
    return db.transaction('images').store.getAll();
  }

  const { store } = db.transaction('images');

  const images: StoredImage[] = [];

  if (typeof seedIds === 'undefined') {
    for await (const cursor of store) {
      if ((!matches || matches(cursor.value))) {
        images.push(cursor.value);
      }
    }
  } else {
    for (const hash of seedIds) {
      const item = await store.get(hash);
      if (item && (!matches || matches(item))) {
        images.push(item);
      }
    }
  }

  return images;
};
