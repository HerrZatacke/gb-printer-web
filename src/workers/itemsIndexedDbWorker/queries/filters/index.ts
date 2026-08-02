import { SpecialTags, specialTags } from '@/consts/SpecialTags';
import { Date } from '@/tools/safeDate';
import { toCreationDate } from '@/tools/toCreationDate';
import {
  type FilterableFacet,
  type ImageQueryFilters,
  type ItemsHostApi,
  type StoredImage,
  type StoredSerializableImageGroup,
} from '@/workers/itemsIndexedDbWorker/types';

export const getFacetMatcher = async (
  hostApi: ItemsHostApi,
  filters?: ImageQueryFilters,
) => {

  const now = toCreationDate(Date.now() - 86400000);
  const recentImportHashes: Set<string> = !filters?.tags?.includes(SpecialTags.FILTER_RECENT)
    ? new Set()
    : new Set(await hostApi.getRecentImports());


  return (facet: FilterableFacet): boolean => {
    if (!filters) {
      return true;
    }

    const {
      tags = [],
      palette,
      frame,
    } = filters;

    const cleanTags = tags.filter((t) => !specialTags.includes(t as SpecialTags));
    const usedSpecialTags = tags.filter((t): t is SpecialTags => specialTags.includes(t as SpecialTags));

    if (cleanTags.length && !cleanTags.some((t) => facet.tags.includes(t))) {
      return false;
    }
    if (palette?.length && !(facet.palette && palette.includes(facet.palette))) {
      return false;
    }
    if (frame?.length && !(facet.frame && frame.includes(facet.frame))) {
      return false;
    }

    for (const special of usedSpecialTags) {
      switch (special) {
        case SpecialTags.FILTER_UNTAGGED:
          if (facet.tags.length > 0) {
            return false;
          }
          break;
        case SpecialTags.FILTER_NEW:
          if (facet.created <= now) {
            return false;
          }
          break;
        case SpecialTags.FILTER_MONOCHROME:
          if (facet.type !== 'mono') {
            return false;
          }
          break;
        case SpecialTags.FILTER_RGB:
          if (facet.type !== 'rgbn') {
            return false;
          }
          break;
        case SpecialTags.FILTER_RECENT:
          if (!(facet.hash && recentImportHashes.has(facet.hash))) {
            return false;
          }
          break;
        case SpecialTags.FILTER_FAVOURITE:
          if (!facet.tags.includes(SpecialTags.FILTER_FAVOURITE)) {
            return false;
          }
          break;
        case SpecialTags.FILTER_COMMENTS:
          if (!facet.meta?.comment) {
            return false;
          }
          break;
        case SpecialTags.FILTER_USERNAME:
          if (!facet.meta?.userName) {
            return false;
          }
          break;
      }
    }
    return true;
  };
};

export const facetFromImage = (image: StoredImage): FilterableFacet => ({
  hash: image.hash,
  tags: image.tags,
  specialTags: image.specialTags,
  palette: typeof image.palette === 'string' ? image.palette : null,
  frame: image.frame ?? null,
  type: image.type,
  created: image.created,
  meta: image.meta || null,
});

export const facetFromSerializableImageGroup = (group: StoredSerializableImageGroup): FilterableFacet => ({
  hash: group.coverImage || null,
  tags: group.tags,
  specialTags: group.specialTags,
  created: group.created,
  palette: null,
  frame: null,
  type: null,
  meta: null,
});
