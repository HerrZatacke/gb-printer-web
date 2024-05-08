import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';
import { State } from '../../app/store/State';
import { Image } from '../../../types/Image';

const getFilteredImages = ({ images: stateImages, filtersActiveTags, sortBy, recentImports }: State): Image[] => (
  [...stateImages]
    .map(addSortIndex)
    .sort(sortImages({ sortBy }))
    .map(removeSortIndex)
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
);

export default getFilteredImages;
