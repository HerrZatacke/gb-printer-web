import type { FiltersState } from '@/stores/filtersStore';
import { addSortIndex, removeSortIndex, sortImages } from '@/tools/sortImages';
import type { Image } from '@/types/Image';
import { TreeImageGroup } from '@/types/ImageGroup';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';

export type FilteredImagesState = Pick<FiltersState, 'sortBy' | 'filtersTags' | 'recentImports' | 'filtersPalettes' | 'filtersFrames'>

export const getFilteredImages = (
  {
    images,
    groups,
  }: Pick<TreeImageGroup, 'images' | 'groups'>,
  {
    filtersTags,
    filtersFrames,
    filtersPalettes,
    sortBy,
    recentImports,
  }: FilteredImagesState,
): Image[] => (
  [...images]
    .map(addSortIndex)
    .sort(sortImages(sortBy))
    .map(removeSortIndex)
    .filter(filterSpecial(filtersTags, filtersFrames, filtersPalettes, recentImports, groups))
    .filter(filterTags(filtersTags))
);
