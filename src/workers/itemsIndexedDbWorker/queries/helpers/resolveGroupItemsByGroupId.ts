import { type IDBPDatabase } from 'idb';
import sortBy from '@/tools/sortby';
import { SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';
import {
  facetFromImage,
  facetFromSerializableImageGroup,
  getMatcher,
} from '@/workers/itemsIndexedDbWorker/queries/filters';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { getImageGroupsFullTree } from '@/workers/itemsIndexedDbWorker/queries/imageGroups';
import {
  type GroupItem,
  type ImageQueryFilters,
  type ImageQuerySort,
  type ItemsDB,
  type ItemsHostApi,
  type StoredImage,
} from '@/workers/itemsIndexedDbWorker/types';

export const resolveGroupItemsByGroupId = async (
  db: IDBPDatabase<ItemsDB>,
  hostApi: ItemsHostApi,
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
    rootGroup = (await getImageGroupsFullTree()).item;
  }

  const imageMatcher = await getMatcher(
    hostApi,
    filters,
  );

  const imageMatchesFilters = (item: StoredImage): boolean => (
    imageMatcher(facetFromImage(item))
  );

  const serializableImageGroupMatchesFilters = (item: SerializableImageGroup): boolean => (
    imageMatcher(facetFromSerializableImageGroup(item))
  );

  const { store: groupsStore } = db.transaction('imagegroups');
  const imageGroup: SerializableImageGroup | undefined = await groupsStore.get(groupId);

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

  const filteredGroups = includeGroups
    ? (
      (await Promise.all(
        groupIds.map(id => groupsStore.get(id)),
      ))
        .filter((g): g is SerializableImageGroup => Boolean(g))
        .filter(serializableImageGroupMatchesFilters)
    )
    : [];

  const images = await resolveAndFilterImages(db, imageMatchesFilters, new Set(imageHashes));

  const coverImageHashes = filteredGroups.map((g) => g.coverImage).filter((h): h is string => Boolean(h));
  const groupImages = await resolveAndFilterImages(db, undefined, new Set(coverImageHashes));

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

    const hasDisplayableItems = Boolean((await resolveGroupItemsByGroupId(db, hostApi, checkGroupItem.group.id, includeGroups, sort, filters)).length);
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
