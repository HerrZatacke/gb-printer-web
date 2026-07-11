import { type IDBPDatabase } from 'idb';
import sortBy from '@/tools/sortby';
import { type Image } from '@/types/Image';
import { getDb, getHostApi } from '@/workers/itemsIndexedDbWorker/db';
import {
  buildFilterSteps,
  getAddPaging,
  getCandidates,
  intersectAll,
  resolveKeyableStep,
} from '@/workers/itemsIndexedDbWorker/queries/queryHelpers';
import { type FilterStep, type GetImagesParams, type ItemsSourceResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getImages = async (params: GetImagesParams): Promise<ItemsSourceResponse<Image>> => {
  const db = await getDb();
  const hostApi = await getHostApi();
  const { store } = db.transaction('images');
  const total = await store.count();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = params;

  const addPaging = getAddPaging<Image>(total, page, pageSize);

  const hasFilters = !!(
    filters?.tags?.length ||
    filters?.palette?.length ||
    filters?.frame?.length
  );

  if (!hasFilters) {
    const index = store.index(sort.field);
    const direction = sort.direction === 'asc' ? 'next' : 'prev';

    let cursor = await index.openCursor(null, direction);
    if (page > 0 && cursor) {
      cursor = await cursor.advance(page * pageSize);
    }

    const images: Image[] = [];
    while (cursor && images.length < pageSize) {
      images.push(cursor.value);
      cursor = await cursor.continue();
    }

    return addPaging(images);
  }

  const steps: FilterStep[] = await buildFilterSteps(filters, hostApi);

  const predicateSteps = steps.filter((s): s is Extract<FilterStep, { kind: 'predicate' }> => s.kind === 'predicate');

  let candidateIds: Set<string> | null = null;
  for (const step of steps) {
    if (step.kind === 'predicate') continue;
    const ids = await resolveKeyableStep(db as IDBPDatabase, step);
    candidateIds = candidateIds ? intersectAll([candidateIds, ids!]) as Set<string> : ids;
  }

  let images = await getCandidates(db as IDBPDatabase, candidateIds);

  for (const step of predicateSteps) {
    images = images.filter(step.test);
  }

  const sortByFieldName = sortBy<Image>(sort.field);

  const sortedItems = sortByFieldName(images);

  return addPaging(sortedItems);
};

export const getImagesByHashes = async (hashes: string[]): Promise<ItemsSourceResponse<Image>> => {
  const db = await getDb();
  const { store } = db.transaction('images');
  const total = await store.count();

  const images = await Promise.all(
    hashes.map(hash => store.get(hash)),
  );

  const filteredImages = images.filter((image): image is Image => Boolean(image));

  const addPaging = getAddPaging<Image>(total, 0, images.length);

  return addPaging(filteredImages);
};
