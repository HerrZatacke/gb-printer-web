import { deleteDB } from 'idb';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';

export const debugReset = async () => {
  const db = await getDb();
  db.close();
  await deleteDB('gb-printer-web--items');
};
