import z from 'zod';
import { ROOT_ID } from '@/tools/createTreeRoot';
import sortBy from '@/tools/sortby';
import uniqueBy from '@/tools/unique/by';
import { type Image, ImageSchema } from '@/types/Image';
import {
  type NewSerializableImageGroup,
  type NewTreeImageGroup,
} from '@/types/ImageGroup';
import { getDb, getHostApi } from '@/workers/itemsIndexedDbWorker/db';
import { getAddPaging } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { getImageGroupsFullTree } from '@/workers/itemsIndexedDbWorker/queries/imageGroups';
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

export const getImages = async (queryParams: ImageQueryParams): Promise<ItemsSourceResponse<Image>> => {
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

  const images = await resolveAndFilterImages(db, hostApi, filters);

  const sortByFieldName = sortBy<Image>(sort.field, sort.direction);

  const sortedItems = sortByFieldName(images);

  return addPaging(sortedItems);
};

export const getHashesByGroupId = async (groupId: string, sort: ImageQuerySort, filters?: ImageQueryFilters): Promise<ItemsSourceResponse<string>> => {
  const db = await getDb();
  const start = performance.now();

  const hostApi = await getHostApi();

  let rootGroup: NewTreeImageGroup | undefined;
  let imageHashes: string[];

  if (!groupId || groupId === ROOT_ID) {
    // getImageGroupsFullTree must be called before creating stores
    rootGroup = (await getImageGroupsFullTree()).item;
  }

  const { store: groupsStore } = db.transaction('imagegroups');
  const imageGroup: NewSerializableImageGroup | undefined = await groupsStore.get(groupId);

  if (imageGroup) {
    imageHashes = imageGroup.images;
  } else if (rootGroup) {
    imageHashes = rootGroup.images;
  } else {
    throw new Error(`could not find imagegroup ${groupId}`);
  }

  const images = await resolveAndFilterImages(db, hostApi, filters, new Set(imageHashes));

  const sortByFieldName = sortBy<StoredImage>(sort.field, sort.direction);

  const sortedImages = sortByFieldName(images);

  const addPaging = getAddPaging<string>(imageHashes.length, 0, imageHashes.length, start, z.string());

  return addPaging(sortedImages.map(({ hash }) => hash));
};

export const getGroupItemsByGroupId = async (groupId: string, queryParams: ImageQueryParams): Promise<ItemsSourceResponse<GroupItem>> => {
  const db = await getDb();
  const start = performance.now();

  const hostApi = await getHostApi();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = queryParams;

  let rootGroup: NewTreeImageGroup | undefined;
  let imageHashes: string[];
  let groupIds: string[];

  if (!groupId || groupId === ROOT_ID) {
    // getImageGroupsFullTree must be called before creating stores
    rootGroup = (await getImageGroupsFullTree()).item;
  }

  const { store: groupsStore } = db.transaction('imagegroups');
  const imageGroup: NewSerializableImageGroup | undefined = await groupsStore.get(groupId);

  if (imageGroup) {
    imageHashes = imageGroup.images;
    groupIds = imageGroup.groups;
  } else if (rootGroup) {
    imageHashes = rootGroup.images;
    groupIds = rootGroup.groups.map((g: NewTreeImageGroup) => g.id);
  } else {
    throw new Error(`could not find imagegroup ${groupId}`);
  }

  const groups = (await Promise.all(
    groupIds.map(id => groupsStore.get(id)),
  )).filter((g): g is NewSerializableImageGroup => Boolean(g));

  const coverImageHashes = groups.map((g) => g.coverImage);

  const { store: imagesStore } = db.transaction('images');
  const total = await imagesStore.count();

  const images = await resolveAndFilterImages(db, hostApi, filters, new Set([...imageHashes, ...coverImageHashes]));

  const groupItems = images.map((image) => {
    const group = groups.find((g) => g.coverImage === image.hash) || null;
    return {
      image,
      group,
      title: group?.title || image.title,
      // created: image.created,
      created: group?.created || image.created,
      frame: image.frame || null,
      palette: typeof image.palette === 'string' ? image.palette : null,
    };
  });

  const sortByFieldName = sortBy<GroupItem>(sort.field, sort.direction);

  const sortedGroupItems = sortByFieldName(groupItems);

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
