import { type IDBPDatabase } from 'idb';
import sortBy from '@/tools/sortby';
import { SerializableImageGroup, TreeImageGroup } from '@/types/ImageGroup';
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
import { getCandidates } from '@/workers/itemsIndexedDbWorker/queries/helpers/imagesKeyQueries';

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

  const groups = includeGroups
    ? (
      (await Promise.all(
        groupIds.map(id => groupsStore.get(id)),
      ))
        .filter((g): g is SerializableImageGroup => Boolean(g))
    )
    : [];


  console.log({ groups });

  const coverImageHashes = groups.map((g) => g.coverImage);

  const images = await resolveAndFilterImages(db, hostApi, filters, new Set(imageHashes));

  // ToDo: Implement filterImageGroups(filters, groups); similar to resolveAndFilterImages but with already preloaded group items
  const groupImages = await getCandidates(db, new Set(coverImageHashes));

  const groupItems = [...images, ...groupImages].map((image) => {
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
