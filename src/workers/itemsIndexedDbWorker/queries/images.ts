import { type IDBPDatabase } from 'idb';
import z from 'zod';
import sortBy from '@/tools/sortby';
import uniqueBy from '@/tools/unique/by';
import { type Image, ImageSchema } from '@/types/Image';
import { getDb, getHostApi } from '@/workers/itemsIndexedDbWorker/db';
import { buildFilterSteps } from '@/workers/itemsIndexedDbWorker/queries/helpers/buildFilterSteps';
import { getAddPaging, intersectAll } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { getCandidates, resolveKeyableStep } from '@/workers/itemsIndexedDbWorker/queries/helpers/imagesKeyQueries';
import {
  type FilterStep,
  type GetImagesParams,
  ItemsReferenceListSchema,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type StoredImage,
} from '@/workers/itemsIndexedDbWorker/types';

const uniqueByHash = uniqueBy<Image>('hash');

export const getImages = async (params: GetImagesParams): Promise<ItemsSourceResponse<Image>> => {
  const db = await getDb();
  const start = performance.now();

  const hostApi = await getHostApi();
  const { store } = db.transaction('images');
  const total = await store.count();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = params;

  const addPaging = getAddPaging<Image>(total, page, pageSize, start, ImageSchema);

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
  const start = performance.now();

  const { store } = db.transaction('images');
  const total = await store.count();

  const images = await Promise.all(
    hashes.map(hash => store.get(hash)),
  );

  const filteredImages = images.filter((image): image is StoredImage => Boolean(image));

  const addPaging = getAddPaging<Image>(total, 0, images.length, start, ImageSchema);

  return addPaging(filteredImages);
};

export const getImagesByAnyHashes = async (hashes: string[]): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('images');
  const total = await store.count();

  const [foundByPrimary, foundByReference] = await Promise.all([
    Promise.all(hashes.map((hash) => store.get(hash))),
    Promise.all(hashes.map((hash) => store.index('referencedHashes').getAll(hash))),
  ]);

  const items = hashes.map((hash): ImageReferenceList => {

    const foundFiltered = [
      foundByPrimary.find((image) => (image?.hash === hash )),
      ...foundByReference.flat().filter((image) => (image?.referencedHashes.includes(hash))),
    ]
      .filter((image): image is StoredImage => Boolean(image));


    return {
      reference: hash,
      items: uniqueByHash(foundFiltered),
    };
  });

  const ImageReferenceListSchema = ItemsReferenceListSchema<typeof ImageSchema>(ImageSchema);
  type ImageReferenceList = z.infer<typeof ImageReferenceListSchema>;

  const addPaging = getAddPaging<ImageReferenceList>(total, 0, items.length, start, ImageReferenceListSchema);

  return addPaging(items);
};

export const getAllTags = async (): Promise<ItemsSourceResponse<string>> => {
  const db = await getDb();
  const start = performance.now();

  const store = db.transaction('images').store;
  const index = store.index('tags');

  const uniqueTags: string[] = [];
  let cursor = await index.openKeyCursor();

  while (cursor) {
    const tag = cursor.key as string;
    if (uniqueTags[uniqueTags.length - 1] !== tag) {
      uniqueTags.push(tag);
    }
    cursor = await cursor.continue();
  }

  const addPaging = getAddPaging<string>(uniqueTags.length, 0, uniqueTags.length, start, z.string());

  return addPaging(uniqueTags);
};
