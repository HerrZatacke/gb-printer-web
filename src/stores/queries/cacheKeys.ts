import  {
  type ImageQueryFilters,
  type ImageQueryParams,
  type ImageQuerySort,
} from '@/workers/itemsIndexedDbWorker/types';

const imageGroupsBaseKeys = ['items', 'imagegroups'] as const;

// *********** ImageGroups ***********
const imageGroupBaseKeys = ['items', 'imagegroups'] as const;

export const imageGroupsKeys = {
  all: imageGroupBaseKeys,
  list: [...imageGroupBaseKeys, 'list'] as const,
  fullTree: [...imageGroupBaseKeys, 'fullTree'] as const,
};

// *********** Images ***********
const imagesBaseKeys = ['items', 'images'] as const;
const imagesByGroupKeys = [...imagesBaseKeys, 'byGroup'] as const;

export const imagesKeys = {
  all: imagesBaseKeys,
  list: [...imagesBaseKeys, 'list'] as const,
  imagesByGroupKeys,
  hashesByGroupId: (groupId: string, includeGroupImageHashes: boolean, sort: ImageQuerySort, filters?: ImageQueryFilters) => [...imagesByGroupKeys, 'hashesByGroupId', { groupId, includeGroupImageHashes, sort, filters }] as const,
  byGroupId: (groupId: string, includeGroups: boolean, params: ImageQueryParams) => [...imagesByGroupKeys, 'byGroupId', { groupId, includeGroups, params }] as const,
  allTags: [...imagesBaseKeys, 'allTags'] as const,
  byHash: (hash: string) => [...imagesBaseKeys, 'byHash', hash] as const,
  byHashes: (hashes: string[]) => [...imagesBaseKeys, 'byHashes', [...hashes].sort()] as const,
  byAnyHashes: (hashes: string[]) => [...imagesBaseKeys, 'byAnyHashes', [...hashes].sort()] as const,
  raw: (raw: ImageQueryParams, candidateHashes?: Set<string>) => [...imagesBaseKeys, 'raw', { raw, candidateHashes }] as const,
};
