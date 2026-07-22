import z from 'zod';
import sortBy from '@/tools/sortby';
import uniqueBy from '@/tools/unique/by';
import { type Image, ImageSchema } from '@/types/Image';
import { getDb, getHostApi } from '@/workers/itemsIndexedDbWorker/db';
import { facetFromImage, getMatcher } from '@/workers/itemsIndexedDbWorker/queries/filters';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { resolveGroupItemsByGroupId } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveGroupItemsByGroupId';
import {
  type ImageQueryParams,
  type GroupItem,
  GroupItemSchema,
  ItemsReferenceListSchema,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type StoredImage,
  StoredImageSchema,
  type ImageQueryFilters,
  type ImageQuerySort,
} from '@/workers/itemsIndexedDbWorker/types';

const uniqueByHash = uniqueBy<Image>('hash');

export const getImages = async (queryParams: ImageQueryParams, candidateHashes?: Set<string>): Promise<ItemsSourceResponse<Image>> => {
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
  } = queryParams;

  const addPaging = getAddPaging<Image>(total, page, pageSize, start, ImageSchema);

  const imageMatcher = await getMatcher(
    hostApi,
    filters,
  );

  const imageFacetMatchesFilters = (item: StoredImage): boolean => (
    imageMatcher(facetFromImage(item))
  );

  const images = await resolveAndFilterImages(db, imageFacetMatchesFilters, candidateHashes);

  const sortByFieldName = sortBy<Image>(sort.field, sort.direction);

  const sortedImages = sortByFieldName(images);

  return addPaging(sortedImages);
};

export const getHashesByGroupId = async (groupId: string, includeGroupImageHashes: boolean, sort: ImageQuerySort, filters?: ImageQueryFilters): Promise<ItemsSourceResponse<string>> => {
  const db = await getDb();
  const start = performance.now();

  const hostApi = await getHostApi();

  const sortedGroupItems = await resolveGroupItemsByGroupId(db, hostApi, groupId, includeGroupImageHashes, sort, filters);
  const sortedImageHashes = sortedGroupItems.map(({ image: { hash } }) => hash);
  const addPaging = getAddPaging<string>(sortedImageHashes.length, 0, sortedImageHashes.length, start, z.string());
  return addPaging(sortedImageHashes);
};

export const getGroupItemsByGroupId = async (groupId: string, includeGroups: boolean, queryParams: ImageQueryParams): Promise<ItemsSourceResponse<GroupItem>> => {
  const db = await getDb();
  const start = performance.now();

  const hostApi = await getHostApi();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = queryParams;

  const { store: imagesStore } = db.transaction('images');
  const total = await imagesStore.count();

  const sortedGroupItems = await resolveGroupItemsByGroupId(db, hostApi, groupId, includeGroups, sort, filters);
  const addPaging = getAddPaging<GroupItem>(total, page, pageSize, start, GroupItemSchema);
  return addPaging(sortedGroupItems);
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

export const updateImages = async (images: Image[], purge: boolean): Promise<void> => {
  const { success, data: parsedImages, error } = z.array(StoredImageSchema).safeParse(images);
  if (success) {
    const db = await getDb();

    const tx = db.transaction('images', 'readwrite');
    const store = tx.store;

    if (purge) {
      await store.clear();
    }

    await Promise.all(parsedImages.map((image) => store.put(image)));
    await tx.done;
  } else {
    console.error(error);
  }
};

export const deleteImagesByHashes = async (hashes: string[]): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('images', 'readwrite');
  const store = tx.store;

  await Promise.all(hashes.map((hash) => store.delete(hash)));
  await tx.done;
};
