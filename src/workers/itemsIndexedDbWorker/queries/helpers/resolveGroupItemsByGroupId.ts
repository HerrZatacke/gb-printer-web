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

  // ToDo: Edge-Case
  // filtering for "testing" and "favourite" shows some empty folders because the folder has BOTH tags but images inside only have one or the other

  const coverImageHashes = filteredGroups.map((g) => g.coverImage);

  const images = await resolveAndFilterImages(db, imageMatchesFilters, new Set(imageHashes));

  const groupImages = await resolveAndFilterImages(db, undefined, new Set(coverImageHashes));

  const groupItems = [...images, ...groupImages].map((image) => {
    const group = filteredGroups.find((g) => g.coverImage === image.hash) || null;
    return {
      image,
      group,
      title: group?.title || image.title,
      created: group?.created || image.created,
      frame: image.frame || null,
      palette: typeof image.palette === 'string' ? image.palette : null,
    };
  });

  const sortByFieldName = sortBy<GroupItem>(sort.field, sort.direction);

  return sortByFieldName(groupItems);
};
