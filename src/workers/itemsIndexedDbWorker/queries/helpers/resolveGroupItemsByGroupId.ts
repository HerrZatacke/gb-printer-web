import { type IDBPDatabase } from 'idb';
import sortBy from '@/tools/sortby';
import { NewSerializableImageGroup, NewTreeImageGroup } from '@/types/ImageGroup';
import { ROOT_ID } from '@/workers/itemsIndexedDbWorker/queries/helpers/createTreeRoot';
import { resolveAndFilterImages } from '@/workers/itemsIndexedDbWorker/queries/helpers/resolveAndFilterImages';
import { getImageGroupsFullTree } from '@/workers/itemsIndexedDbWorker/queries/imageGroups';
import {
  GroupItem,
  type ImageQueryFilters,
  type ImageQuerySort,
  type ItemsDB,
  type ItemsHostApi,
} from '@/workers/itemsIndexedDbWorker/types';

export const resolveGroupItemsByGroupId = async (
  db: IDBPDatabase<ItemsDB>,
  hostApi: ItemsHostApi,
  groupId: string,
  includeGroups: boolean,
  sort: ImageQuerySort,
  filters?: ImageQueryFilters,
): Promise<GroupItem[]> => {
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

  const groups = includeGroups
    ? (
      (await Promise.all(
        groupIds.map(id => groupsStore.get(id)),
      ))
        .filter((g): g is NewSerializableImageGroup => Boolean(g))
    )
    : [];


  const coverImageHashes = groups.map((g) => g.coverImage);

  const hashSet = includeGroups ? new Set([...imageHashes, ...coverImageHashes]) : new Set(imageHashes);

  const images = await resolveAndFilterImages(db, hostApi, filters, hashSet);

  const groupItems = images.map((image) => {
    const group = groups.find((g) => g.coverImage === image.hash) || null;
    return {
      image,
      group,
      title: group?.title || image.title,
      // created: image.created, // in the "old" version, all items were sorted by image creationdate not group creationdate (same for title)
      created: group?.created || image.created,
      frame: image.frame || null,
      palette: typeof image.palette === 'string' ? image.palette : null,
    };
  });

  const sortByFieldName = sortBy<GroupItem>(sort.field, sort.direction);

  return sortByFieldName(groupItems);
};
