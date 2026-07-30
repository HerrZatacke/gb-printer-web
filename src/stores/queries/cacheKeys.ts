import  {
  type ImageQueryFilters,
  type ImageQueryParams,
  type ImageQuerySort,
} from '@/workers/itemsIndexedDbWorker/types';

// *********** Frame Groups ***********
const frameGroupBaseKeys = ['items', 'framegroups'] as const;

export const frameGroupsKeys = {
  all: frameGroupBaseKeys,
  list: [...frameGroupBaseKeys, 'list'] as const,
};


// *********** Frames ***********
const frameBaseKeys = ['items', 'frames'] as const;

export const framesKeys = {
  all: frameBaseKeys,
  list: [...frameBaseKeys, 'list'] as const,
  byIds: (ids: string[]) => [...frameBaseKeys, 'byIds', [...ids].sort()] as const,
  byHashes: (hashes: string[]) => [...frameBaseKeys, 'byHashes', [...hashes].sort()] as const,
};


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


// *********** Palettes ***********
const paletteBaseKeys = ['items', 'palettes'] as const;

export const palettesKeys = {
  all: paletteBaseKeys,
  list: [...paletteBaseKeys, 'list'] as const,
  byShortName: (shortName: string) => [...paletteBaseKeys, 'byShortName', shortName] as const,
  byShortNames: (shortNames: string[]) => [...paletteBaseKeys, 'byShortNames', [...shortNames].sort()] as const,
};


// *********** Plugins ***********
const pluginBaseKeys = ['items', 'plugins'] as const;

export const pluginsKeys = {
  all: pluginBaseKeys,
  list: [...pluginBaseKeys, 'list'] as const,
  byUrl: (url: string) => [...pluginBaseKeys, 'byUrl', url] as const,
  byUrls: (urls: string[]) => [...pluginBaseKeys, 'byUrls', [...urls].sort()] as const,
};

export const trashCheckKeys = [
  imageGroupsKeys.all,
  imagesKeys.all,
  framesKeys.all,
];
