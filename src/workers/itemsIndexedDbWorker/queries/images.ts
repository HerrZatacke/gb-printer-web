import z from 'zod';
import sortBy from '@/tools/sortby';
import uniqueBy from '@/tools/unique/by';
import { type Image, ImageSchema } from '@/types/Image';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { facetFromImage, getFacetMatcher } from '@/workers/itemsIndexedDbWorker/queries/filters';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { resolveGroupItemsByGroupId } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveGroupItemsByGroupId';
import {
  GroupItemSchema,
  ImageQueryFiltersSchema,
  ImageQuerySortSchema,
  ImageQueryParamsSchema,
  ItemsReferenceListSchema,
  StoredImageSchema,
} from '@/workers/itemsIndexedDbWorker/schemas';
import {
  type GroupItem,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type StoredImage,
  type ItemsSourceTotalResponse,
  type GroupItemImage,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesParams,
  type GetImagesByHashesParams,
  type GetImagesByAnyHashesParams,
  type UpdateImagesParams,
  type DeleteImagesByHashesParams,
} from '@/workers/itemsIndexedDbWorker/types';

const uniqueByHash = uniqueBy<Image>('hash');

export const getImages = async ({ params: queryParamsRaw, candidateHashes }: GetImagesParams): Promise<ItemsSourceResponse<Image>> => {
  const db = await getDb();
  const start = performance.now();

  const { store } = db.transaction('images');
  const total = await store.count();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = ImageQueryParamsSchema.parse(queryParamsRaw);

  const addPaging = getAddPaging<Image>(total, page, pageSize, start, ImageSchema);

  const facetMatcher = await getFacetMatcher(filters);

  const imageFacetMatchesFilters = (item: StoredImage): boolean => (
    facetMatcher(facetFromImage(item))
  );

  const images = await resolveAndFilterImages(db, imageFacetMatchesFilters, candidateHashes);

  const sortByFieldName = sortBy<Image>(sort.field, sort.direction);

  const sortedImages = sortByFieldName(images);

  return addPaging(sortedImages);
};

export const getHashesByGroupId = async ({ groupId, includeGroups, sort: sortRaw, filters: filtersRaw } : GetHashesByGroupIdParams): Promise<ItemsSourceTotalResponse<string>> => {
  const db = await getDb();
  const start = performance.now();

  const sort = ImageQuerySortSchema.parse(sortRaw);
  const filters = ImageQueryFiltersSchema.optional().parse(filtersRaw);

  const sortedGroupItems = await resolveGroupItemsByGroupId(db, groupId, includeGroups, sort, filters);
  const sortedImageHashes = sortedGroupItems
    .filter((item): item is GroupItemImage => item.type === 'image')
    .map(({ image: { hash } }) => hash);
  const addPaging = getAddTotal<string>(sortedImageHashes.length, start, z.string());
  return addPaging(sortedImageHashes);
};

export const getGroupItemsByGroupId = async ({ groupId, includeGroups, params: queryParamsRaw }: GetGroupItemsByGroupIdParams): Promise<ItemsSourceResponse<GroupItem>> => {
  const db = await getDb();
  const start = performance.now();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = ImageQueryParamsSchema.parse(queryParamsRaw);

  const { store: imagesStore } = db.transaction('images');
  const total = await imagesStore.count();

  const sortedGroupItems = await resolveGroupItemsByGroupId(db, groupId, includeGroups, sort, filters);
  const addPaging = getAddPaging<GroupItem>(total, page, pageSize, start, GroupItemSchema);
  return addPaging(sortedGroupItems);
};

export const getImagesByHashes = async ({ hashes }: GetImagesByHashesParams): Promise<ItemsSourceResponse<Image>> => {
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

export const getImagesByAnyHashes = async ({ hashes }: GetImagesByAnyHashesParams): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>> => {
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

export const getAllTags = async (): Promise<ItemsSourceTotalResponse<string>> => {
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

  const addPaging = getAddTotal<string>(uniqueTags.length, start, z.string());

  return addPaging(uniqueTags);
};

export const updateImages = async ({ images, purge }: UpdateImagesParams): Promise<void> => {
  const parsedImages = z.array(StoredImageSchema).parse(images);
  const db = await getDb();

  const tx = db.transaction('images', 'readwrite');
  const store = tx.store;

  if (purge) {
    await store.clear();
  }

  await Promise.all(parsedImages.map((image) => store.put(image)));
  await tx.done;
  await startMaintenanceTasks(db);
};

export const deleteImagesByHashes = async ({ hashes }: DeleteImagesByHashesParams): Promise<void> => {
  const db = await getDb();

  const tx = db.transaction('images', 'readwrite');
  const store = tx.store;

  await Promise.all(hashes.map((hash) => store.delete(hash)));
  await tx.done;

  await startMaintenanceTasks(db);
};
