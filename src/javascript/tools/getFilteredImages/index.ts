import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';
import type { State } from '../../app/store/State';
import type { Image } from '../../../types/Image';

export type FilteredImagesState = Pick<State, 'imageSelection' | 'sortBy' | 'filtersActiveTags' | 'recentImports'>

const getFilteredImages = (
  {
    filtersActiveTags,
    sortBy,
    recentImports,
  }: State | FilteredImagesState,
  images: Image[],
): Image[] => (
  [...images]
    .map(addSortIndex)
    .sort(sortImages({ sortBy }))
    .map(removeSortIndex)
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
);

export default getFilteredImages;
