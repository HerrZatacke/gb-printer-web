import { type IDBPDatabase } from 'idb';
import {
  type FilterStep,
  type ItemsDB,
  type StoredImage,
} from '@/workers/itemsIndexedDbWorker/types';

export const resolveIndexNone = async (
  db: IDBPDatabase,
  indexName: string,
): Promise<Set<string>> => {
  const { store } = db.transaction('images');
  const allIds = new Set(await store.getAllKeys());
  const referenced = new Set(await store.index(indexName).getAllKeys());
  return new Set([...allIds].filter((id) => !referenced.has(id))) as Set<string>;
};

export const getCandidates = async (
  db: IDBPDatabase<ItemsDB>,
  candidateIds: Set<string> | null,
) => {
  const { store } = db.transaction('images');
  if (candidateIds) {
    const items = await Promise.all(
      [...candidateIds].map((id) => {
        try {
          return store.get(id);
        } catch (err) {
          console.log(err);
          return null;
        }
      }),
    );
    return items.filter((i): i is StoredImage => Boolean(i));
  } else {
    // only predicate filters present (or none) — full scan unavoidable
    return await store.getAll();
  }
};

export const keysMatchingAny = async (
  db: IDBPDatabase,
  indexName: string,
  values: string[],
): Promise<Set<string>> => {
  const { store } = db.transaction('images');
  const keySets = await Promise.all(
    values.map((v) => store.index(indexName).getAllKeys(IDBKeyRange.only(v))),
  );
  return new Set(keySets.flat()) as Set<string>;
};


// export const keysMatchingAll = async (
//   db: IDBPDatabase,
//   indexName: string,
//   values: string[],
// ): Promise<Set<string>> => {
//   const { store } = db.transaction('images');
//   const keySets = await Promise.all(
//     values.map(async (v) => new Set(await store.index(indexName).getAllKeys(IDBKeyRange.only(v)))),
//   );
//   return keySets.reduce((acc, s) => (
//     new Set([...acc].filter((id) => s.has(id)))
//   )) as Set<string>;
// };

export const keysByRange = async (
  db: IDBPDatabase,
  indexName: string,
  range: IDBKeyRange,
): Promise<Set<string>> => {
  const { store } = db.transaction('images');
  return new Set(await store.index(indexName).getAllKeys(range) as string[]);
};

export const resolveKeyableStep = async (
  db: IDBPDatabase,
  step: FilterStep,
): Promise<Set<string> | null> => {
  switch (step.kind) {
    case 'indexAny': {
      return keysMatchingAny(db, step.indexName, step.values);
    }

    case 'indexNone': {
      return resolveIndexNone(db, step.indexName);
    }

    case 'indexRange': {
      return keysByRange(db, step.indexName, step.range);
    }

    case 'ids': {
      return step.ids;
    }

    // not resolvable by key — handled separately}
    case 'predicate': {
      return null;
    }
  }
};
