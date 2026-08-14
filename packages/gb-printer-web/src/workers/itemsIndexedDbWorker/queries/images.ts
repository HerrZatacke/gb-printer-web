import {
  GroupItemSchema,
  ImageQueryFiltersSchema,
  ImageQueryParamsSchema,
  ImageQuerySortSchema,
  ImageSchema,
  ItemsReferenceListSchema,
  StoredImageSchema,
  type DeleteImagesByHashesParams,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesByAnyHashesParams,
  type GetImagesByHashesParams,
  type GetImagesParams,
  type GroupItem,
  type Image,
  type ItemsReferenceList,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type StoredImage,
  type UpdateImagesParams,
} from 'gb-printer-schemas';
import z from 'zod';
import sortBy from '@/tools/sortby';
import uniqueBy from '@/tools/unique/by';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { startMaintenanceTasks } from '@/workers/itemsIndexedDbWorker/maintenance';
import { facetFromImage, getFacetMatcher } from '@/workers/itemsIndexedDbWorker/queries/filters';
import { getAddPaging, getAddTotal } from '@/workers/itemsIndexedDbWorker/queries/helpers/generic';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { resolveGroupItemsByGroupId } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveGroupItemsByGroupId';

const uniqueByHash = uniqueBy<Image>('hash');

export const getImages = async ({ params: queryParamsRaw, candidateHashes }: GetImagesParams): Promise<ItemsSourceResponse<Image>> => {
  const repositories = await getDb();
  const { images: repository } = repositories;
  const start = performance.now();

  const total = await repository.count();

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

  const images = await resolveAndFilterImages(repositories, imageFacetMatchesFilters, candidateHashes);

  const sortByFieldName = sortBy<Image>(sort.field, sort.direction);

  const sortedImages = sortByFieldName(images);

  return addPaging(sortedImages);
};

export const getHashesByGroupId = async ({ groupId, includeGroups, sort: sortRaw, filters: filtersRaw } : GetHashesByGroupIdParams): Promise<ItemsSourceTotalResponse<string>> => {
  const repositories = await getDb();
  const start = performance.now();

  const sort = ImageQuerySortSchema.parse(sortRaw);
  const filters = ImageQueryFiltersSchema.optional().parse(filtersRaw);

  const sortedGroupItems = await resolveGroupItemsByGroupId(repositories, groupId, includeGroups, sort, filters);
  const sortedImageHashes = sortedGroupItems
    .map((item: GroupItem) => {
      switch (item.type) {
        case 'image':
          return item.image.hash;
        case 'group':
          return item.group.id;
        default:
          throw new Error('unknown group item type', item);
      }
    });
  const addPaging = getAddTotal<string>(sortedImageHashes.length, start, z.string());
  return addPaging(sortedImageHashes);
};

export const getGroupItemsByGroupId = async ({ groupId, includeGroups, params: queryParamsRaw }: GetGroupItemsByGroupIdParams): Promise<ItemsSourceResponse<GroupItem>> => {
  const repositories = await getDb();
  const start = performance.now();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = ImageQueryParamsSchema.parse(queryParamsRaw);

  const total = await repositories.images.count();

  const sortedGroupItems = await resolveGroupItemsByGroupId(repositories, groupId, includeGroups, sort, filters);
  const addPaging = getAddPaging<GroupItem>(total, page, pageSize, start, GroupItemSchema);
  return addPaging(sortedGroupItems);
};

export const getImagesByHashes = async ({ hashes }: GetImagesByHashesParams): Promise<ItemsSourceResponse<Image>> => {
  const { images: repository } = await getDb();
  const start = performance.now();

  const total = await repository.count();

  const images = await Promise.all(
    hashes.map(hash => repository.getByKey(hash)),
  );

  const filteredImages = images.filter((image): image is StoredImage => Boolean(image));

  const addPaging = getAddPaging<Image>(total, 0, images.length, start, ImageSchema);

  return addPaging(filteredImages);
};

export const getImagesByAnyHashes = async ({ hashes }: GetImagesByAnyHashesParams): Promise<ItemsSourceResponse<ItemsReferenceList<Image>>> => {
  const { images: repository } = await getDb();
  const start = performance.now();

  const total = await repository.count();

  const [foundByPrimary, foundByReference] = await Promise.all([
    Promise.all(hashes.map((hash) => repository.getByKey(hash))),
    repository.getByIndexValues('referencedHashes', hashes),
  ]);

  const items = hashes.map((hash): ImageReferenceList => {

    const foundFiltered = [
      foundByPrimary.find((image) => (image?.hash === hash )),
      ...foundByReference.filter((image) => (image?.referencedHashes.includes(hash))),
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
  const { images: repository } = await getDb();
  const start = performance.now();

  const uniqueTags = await repository.getDistinctIndexValues('tags');

  const addPaging = getAddTotal<string>(uniqueTags.length, start, z.string());

  return addPaging(uniqueTags);
};

export const updateImages = async ({ images, purge }: UpdateImagesParams): Promise<void> => {
  const parsedImages = z.array(StoredImageSchema).parse(images);
  const { images: repository } = await getDb();

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedImages.map((image) => ({
      key: image.hash,
      value: image,
    })),
  );

  await startMaintenanceTasks();
};

export const deleteImagesByHashes = async ({ hashes }: DeleteImagesByHashesParams): Promise<void> => {
  const { images: repository } = await getDb();
  await repository.deleteByKeys(hashes);

  await startMaintenanceTasks();
};
