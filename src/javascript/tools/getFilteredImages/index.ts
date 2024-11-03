import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';
import type { FiltersState } from '../../app/stores/filtersStore';
import type { Image } from '../../../types/Image';

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
