import {
  GroupItemSchema,
  ImageQueryFiltersSchema,
  ImageQueryParamsSchema,
  ImageQuerySortSchema,
  ImageSchema,
  ItemStoreNames,
  StoredImageSchema,
  type DeleteImagesByHashesParams,
  type GetGroupItemsByGroupIdParams,
  type GetHashesByGroupIdParams,
  type GetImagesByHashesParams,
  type GetImagesParams,
  type GroupItem,
  type Image,
  type ItemsSourceResponse,
  type ItemsSourceTotalResponse,
  type StoredImage,
  type UpdateImagesParams,
  type TreeImageGroup,
  type ItemsMutationReponse,
} from 'gb-printer-schemas';
import z from 'zod';
import { startMaintenanceTasks } from '@/maintenance';
import { facetFromImage, getFacetMatcher } from '@/queries/filters';
import { getAddPaging, getAddTotal, getMutationReponse } from '@/queries/helpers/generic';
import { resolveAndFilterImages } from '@/queries/helpers/resolveAndFilterImages';
import { resolveGroupItemsByGroupId } from '@/queries/helpers/resolveGroupItemsByGroupId';
import sortBy from '@/temptools/sortby';
import uniqueBy from '@/temptools/unique/by';
import { type ItemsSourceInternal } from '@/types';

// ToDo: get from tools package once available
const uniqueByHash = uniqueBy<Image>('hash');

export async function getImages(this: ItemsSourceInternal, { params: queryParamsRaw, candidateHashes }: GetImagesParams): Promise<ItemsSourceResponse<Image>> {
  // ToDo: Parse full params not only params!!
  const { repositories } = this;
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
}

export async function getHashesByGroupId(this: ItemsSourceInternal, { groupId, includeGroups, sort: sortRaw, filters: filtersRaw }: GetHashesByGroupIdParams): Promise<ItemsSourceTotalResponse<string>> {
  const { repositories } = this;
  const start = performance.now();

  const sort = ImageQuerySortSchema.parse(sortRaw);
  const filters = ImageQueryFiltersSchema.optional().parse(filtersRaw);

  const getFullTree = async (): Promise<TreeImageGroup> => {
    const root = await this.getImageGroupsFullTree();
    return root.item;
  };

  const sortedGroupItems = await resolveGroupItemsByGroupId(getFullTree, repositories, groupId, includeGroups, sort, filters);
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
}

export async function getGroupItemsByGroupId(this: ItemsSourceInternal, { groupId, includeGroups, params: queryParamsRaw }: GetGroupItemsByGroupIdParams): Promise<ItemsSourceResponse<GroupItem>> {
  const { repositories } = this;
  const start = performance.now();

  const {
    page,
    pageSize,
    sort,
    filters,
  } = ImageQueryParamsSchema.parse(queryParamsRaw);

  const total = await repositories.images.count();

  const getFullTree = async (): Promise<TreeImageGroup> => {
    const root = await this.getImageGroupsFullTree();
    return root.item;
  };

  const sortedGroupItems = await resolveGroupItemsByGroupId(getFullTree, repositories, groupId, includeGroups, sort, filters);
  const addPaging = getAddPaging<GroupItem>(total, page, pageSize, start, GroupItemSchema);
  return addPaging(sortedGroupItems);
}

export async function getImagesByHashes(this: ItemsSourceInternal, { hashes }: GetImagesByHashesParams): Promise<ItemsSourceResponse<Image>> {
  const { images: repository } = this.repositories;
  const start = performance.now();

  const total = await repository.count();

  const images = await Promise.all(
    hashes.map(hash => repository.getByKey(hash)),
  );

  const filteredImages = images.filter((image): image is StoredImage => Boolean(image));

  const addPaging = getAddPaging<Image>(total, 0, images.length, start, ImageSchema);

  return addPaging(filteredImages);
}

export async function imageExistsByAnyHash(this: ItemsSourceInternal, hash: string): Promise<boolean> {
  const { images: repository } = this.repositories;

  const [foundByPrimary, foundByReference] = await Promise.all([
    repository.getByKey(hash),
    repository.getByIndexValues('referencedHashes', [hash]),
  ]);

  const foundFiltered = [
    foundByPrimary,
    ...foundByReference,
  ]
    .filter((image): image is StoredImage => Boolean(image));

  return Boolean(uniqueByHash(foundFiltered).length);
}

export async function getAllTags(this: ItemsSourceInternal): Promise<ItemsSourceTotalResponse<string>> {
  const { images: repository } = this.repositories;
  const start = performance.now();

  const uniqueTags = await repository.getDistinctIndexValues('tags');

  const addPaging = getAddTotal<string>(uniqueTags.length, start, z.string());

  return addPaging(uniqueTags);
}

export async function updateImages(this: ItemsSourceInternal, { images, purge }: UpdateImagesParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const parsedImages = z.array(StoredImageSchema).parse(images);
  const { images: repository } = this.repositories;

  if (purge) {
    await repository.clear();
  }

  await repository.put(
    parsedImages.map((image) => ({
      key: image.hash,
      value: image,
    })),
  );

  const invalidations = await startMaintenanceTasks(this.repositories);
  return mutationReponse([...invalidations, { collection: ItemStoreNames.IMAGES }, { collection: ItemStoreNames.BINARYIMAGES }]);
}

export async function deleteImagesByHashes(this: ItemsSourceInternal, { hashes }: DeleteImagesByHashesParams): Promise<ItemsMutationReponse> {
  const mutationReponse = getMutationReponse(performance.now());
  const { images: repository } = this.repositories;
  await repository.deleteByKeys(hashes);

  const invalidations = await startMaintenanceTasks(this.repositories);
  return mutationReponse([...invalidations, { collection: ItemStoreNames.IMAGES }, { collection: ItemStoreNames.BINARYIMAGES }]);
}
