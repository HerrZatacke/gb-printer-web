import {
  type TreeImageGroup,
  type GroupItem,
  type ImageQueryFilters,
  type ImageQuerySort,
  type StoredImage,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import sortBy from '@/tools/sortby';
import {
  facetFromImage,
  facetFromSerializableImageGroup,
  getFacetMatcher,
} from '@/workers/itemsIndexedDbWorker/queries/filters';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { Repositories } from '@/workers/itemsIndexedDbWorker/repository/entities';

export const resolveGroupItemsByGroupId = async (
  getFullTree: () => Promise<TreeImageGroup>,
  repositories: Repositories,
  groupId: string,
  includeGroups: boolean,
  sort: ImageQuerySort,
  filters?: ImageQueryFilters,
): Promise<GroupItem[]> => {
  let rootGroup: TreeImageGroup | undefined;
  let imageHashes: string[];
  let groupIds: string[];

  if (!groupId || groupId === ROOT_ID) {
    // getImageGroupsFullTree must be called before creating stores
    rootGroup = await getFullTree();
  }

  const facetMatcher = await getFacetMatcher(filters);

  const { imageGroups: imageGroupsRepository } = repositories;

  const imageGroup: StoredSerializableImageGroup | undefined = await imageGroupsRepository.getByKey(groupId);

  if (!imageGroup && !rootGroup) {
    throw new Error('Group by ID not found');
  }

  if (imageGroup) {
    imageHashes = imageGroup.images;
    groupIds = imageGroup.groups;
  } else if (rootGroup) {
    imageHashes = rootGroup.images;
    groupIds = rootGroup.groups.map((g: TreeImageGroup) => g.id);
  } else {
    throw new Error(`could not find imagegroup ${groupId}`);
  }

  let filteredGroups: StoredSerializableImageGroup[] = [];

  if (includeGroups) {
    const serializableImageGroupMatchesFilters = (item: StoredSerializableImageGroup): boolean => (
      facetMatcher(facetFromSerializableImageGroup(item))
    );

    const loadedGroups = await Promise.all(
      groupIds.map((id): Promise<StoredSerializableImageGroup | undefined> => imageGroupsRepository.getByKey(id)),
    );

    filteredGroups = loadedGroups
      .filter((g): g is StoredSerializableImageGroup => Boolean(g))
      .filter(serializableImageGroupMatchesFilters);
  }


  const imageMatchesFilters = (item: StoredImage): boolean => (
    facetMatcher(facetFromImage(item))
  );
  const images = await resolveAndFilterImages(repositories, imageMatchesFilters, new Set(imageHashes));

  const coverImageHashes = filteredGroups.map((g) => g.coverImage).filter((h): h is string => Boolean(h));
  const groupImages = await resolveAndFilterImages(repositories, undefined, new Set(coverImageHashes));

  const imageItems = images.map((image): GroupItem => {
    return {
      type: 'image',
      image,
      title: image.title,
      created: image.created,
      frame: image.frame || null,
      palette: typeof image.palette === 'string' ? image.palette : null,
    };
  });

  const groupCoverItems = filteredGroups.map((group): GroupItem => {
    const image = groupImages.find((gi) => gi.hash === group.coverImage) || null;

    return {
      type: 'group',
      group,
      title: group.title,
      created: group.created,
      frame: image?.frame || null,
      palette: typeof image?.palette === 'string' ? image.palette : null,
    };
  });

  const groupItems: GroupItem[] = [...imageItems, ...groupCoverItems];

  // groupItems must be filtered recursively to account for Edge-Case:
  // filtering for multiple tags cahn show empty folders because the folder
  // may have BOTH tags but items inside only have one or the other and would be filtered outh
  const deepFilteredGroupItems = (await Promise.all(groupItems.map(async (checkGroupItem): Promise<GroupItem | null> => {
    const isGroup = checkGroupItem.type === 'group';

    if (!isGroup) {
      // not a group, so it's already a valid groupItem
      return checkGroupItem;
    }

    const hasDisplayableItems = Boolean((await resolveGroupItemsByGroupId(
      getFullTree,
      repositories,
      checkGroupItem.group.id,
      includeGroups,
      sort,
      filters,
    )).length);
    return hasDisplayableItems ? checkGroupItem : null;
  })))
    .filter((gi): gi is GroupItem => Boolean(gi));

  if (!deepFilteredGroupItems.length && !groupImages.length) {
    return [];
  }

  const sortByFieldName = sortBy<GroupItem>(sort.field, sort.direction);

  // console.log(`### ${imageGroup?.title || 'ROOT'}`, deepFilteredGroupItems.length);
  return sortByFieldName(deepFilteredGroupItems);
};
