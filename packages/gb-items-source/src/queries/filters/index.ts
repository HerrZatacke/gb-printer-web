import {
  SpecialTags,
  specialTags,
  type ImageQueryFilters,
  type StoredImage,
  type StoredSerializableImageGroup,
} from 'gb-printer-schemas';
import { FilterableFacet } from '@/types';

export const getFacetMatcher = async (filters?: ImageQueryFilters) => {

  return (facet: FilterableFacet): boolean => {
    if (!filters) {
      return true;
    }

    const {
      tags = [],
      palette = [],
      frame = [],
    } = filters;

    const filterTags = tags.filter((t) => !specialTags.includes(t as SpecialTags));
    const filterSpecialTags = tags.filter((t): t is SpecialTags => specialTags.includes(t as SpecialTags));

    if (filterTags.length && !filterTags.some((t) => facet.tags.includes(t))) {
      return false;
    }
    if (filterSpecialTags.length && !filterSpecialTags.some((t) => facet.specialTags.includes(t))) {
      return false;
    }
    if (palette?.length && !palette.some((p) => facet.palettes.includes(p))) {
      return false;
    }
    if (frame?.length && !frame.some((f) => facet.frames.includes(f))) {
      return false;
    }

    return true;
  };
};

export const facetFromImage = (image: StoredImage): FilterableFacet => ({
  tags: image.tags,
  specialTags: image.specialTags,
  palettes: typeof image.palette === 'string' ? [image.palette] : [],
  frames: image.frame ? [image.frame] : [],
});

export const facetFromSerializableImageGroup = (group: StoredSerializableImageGroup): FilterableFacet => ({
  tags: group.tags,
  specialTags: group.specialTags,
  palettes: group.palettes,
  frames: group.frames,
});
