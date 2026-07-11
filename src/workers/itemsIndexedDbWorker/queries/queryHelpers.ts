import { type IDBPDatabase } from 'idb';
import { specialTags, SpecialTags } from '@/consts/SpecialTags';
import { Date } from '@/tools/safeDate';
import { toCreationDate } from '@/tools/toCreationDate';
import { Image } from '@/types/Image';
import {
  type FilterStep,
  type GetImagesFilters,
  type ItemsHostApi,
  type ItemsSourceResponse,
} from '@/workers/itemsIndexedDbWorker/types';

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

export const intersectAll = (
  sets: Set<string>[],
): Set<string> => {
  return sets.reduce((acc, s) => new Set([...acc].filter((id) => s.has(id))));
};

export const resolveIndexNone = async (
  db: IDBPDatabase,
  indexName: string,
): Promise<Set<string>> => {
  const { store } = db.transaction('images');
  const allIds = new Set(await store.getAllKeys());
  const referenced = new Set(await store.index(indexName).getAllKeys());
  return new Set([...allIds].filter((id) => !referenced.has(id))) as Set<string>;
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

export const getCandidates = async (
  db: IDBPDatabase,
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
    return items.filter((i): i is Image => Boolean(i));
  } else {
    // only predicate filters present (or none) — full scan unavoidable
    return await store.getAll();
  }
};

export const buildFilterSteps = async (filters: GetImagesFilters, hostApi: ItemsHostApi): Promise<FilterStep[]> => {
  const { tags, palette, frame } = filters;
  const steps: FilterStep[] = [];

  const cleanTags = (tags || []).filter((tag) => !specialTags.includes(tag as SpecialTags));
  const usedSpecialTags = (tags || []).filter((tag): tag is SpecialTags => specialTags.includes(tag as SpecialTags));

  if (cleanTags?.length) {
    steps.push({
      kind: 'indexAny',
      indexName: 'tags',
      values: cleanTags,
    });
  }

  if (palette?.length) {
    steps.push({
      kind: 'indexAny',
      indexName: 'palette',
      values: palette,
    });
  }

  if (frame?.length) {
    steps.push({
      kind: 'indexAny',
      indexName: 'frame',
      values: frame,
    });
  }


  for (const specialTag of usedSpecialTags) {
    switch (specialTag) {
      case SpecialTags.FILTER_UNTAGGED: {
        steps.push({
          kind: 'indexNone',
          indexName: 'tags',
        });
        break;
      }

      case SpecialTags.FILTER_NEW: {
        steps.push({
          kind: 'indexRange',
          indexName: 'created',
          range: IDBKeyRange.lowerBound(toCreationDate(Date.now() - 86400000), true),
        });
        break;
      }

      case SpecialTags.FILTER_MONOCHROME: {
        steps.push({
          kind: 'indexAny',
          indexName: 'type',
          values: ['mono'],
        });
        break;
      }

      case SpecialTags.FILTER_RGB: {
        steps.push({
          kind: 'indexAny',
          indexName: 'type',
          values: ['rgbn'],
        });
        break;
      }

      case SpecialTags.FILTER_RECENT: {
        const ids = await hostApi.getRecentImports();
        console.log(ids);
        steps.push({
          kind: 'ids',
          ids,
        });
        break;
      }

      case SpecialTags.FILTER_FAVOURITE: {
        steps.push({
          kind: 'indexAny',
          indexName: 'tags',
          values: [SpecialTags.FILTER_FAVOURITE],
        });
        break;
      }

      case SpecialTags.FILTER_COMMENTS: {
        steps.push({
          kind: 'predicate',
          test: (image: Image) => Boolean(image.meta?.comment),
        });
        break;
      }

      case SpecialTags.FILTER_USERNAME: {
        steps.push({
          kind: 'predicate',
          test: (image: Image) => Boolean(image.meta?.userName),
        });
        break;
      }
    }
  }

  return steps;
};


export const getAddPaging = <T>(
  total: number,
  page: number,
  pageSize: number,
) => (
  sortedItems: T[],
): ItemsSourceResponse<T> => {
  const start = page * pageSize;

  return {
    items: sortedItems.slice(start, start + pageSize),
    paging: {
      filtered: sortedItems.length,
      total,
      pageSize,
      page,
    },
  };
};
