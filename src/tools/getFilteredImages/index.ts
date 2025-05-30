import type { FiltersState } from '@/stores/filtersStore';
import { addSortIndex, removeSortIndex, sortImages } from '@/tools/sortImages';
import type { Image } from '@/types/Image';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';

export type FilteredImagesState = Pick<FiltersState, 'sortBy' | 'filtersActiveTags' | 'recentImports'>

export const getFilteredImages = (
  images: Image[],
  {
    filtersActiveTags,
    sortBy,
    recentImports,
  }: FilteredImagesState,
): Image[] => (
  [...images]
    .map(addSortIndex)
    .sort(sortImages(sortBy))
    .map(removeSortIndex)
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
);
