import { SpecialTags, specialTags } from '@/consts/SpecialTags';
import {
  type FilterableFacet,
  type ImageQueryFilters,
  type StoredImage,
  type StoredSerializableImageGroup,
} from '@/workers/itemsIndexedDbWorker/types';

export const getFacetMatcher = async (filters?: ImageQueryFilters) => {

  return (facet: FilterableFacet): boolean => {
    if (!filters) {
      return true;
    }

    const {
      tags = [],
      palette,
      frame,
    } = filters;

    const filterTags = tags.filter((t) => !specialTags.includes(t as SpecialTags));
    const filterSpecialTags = tags.filter((t): t is SpecialTags => specialTags.includes(t as SpecialTags));

    if (filterTags.length && !filterTags.some((t) => facet.tags.includes(t))) {
      return false;
    }
    if (filterSpecialTags.length && !filterSpecialTags.some((t) => facet.specialTags.includes(t))) {
      return false;
    }
    if (palette?.length && !(facet.palette && palette.includes(facet.palette))) {
      return false;
    }
    if (frame?.length && !(facet.frame && frame.includes(facet.frame))) {
      return false;
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
