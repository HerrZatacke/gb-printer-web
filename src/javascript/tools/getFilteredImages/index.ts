import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';
import { State } from '../../app/store/State';
import { Image } from '../../../types/Image';

export type FilteredImagesState = Pick<State, 'imageSelection' | 'images' | 'sortBy' | 'filtersActiveTags' | 'recentImports'>

const getFilteredImages = ({
  images,
  filtersActiveTags,
  sortBy,
  recentImports,
}: State | FilteredImagesState): Image[] => (
  [...images]
    .map(addSortIndex)
    .sort(sortImages({ sortBy }))
    .map(removeSortIndex)
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
);

export default getFilteredImages;
