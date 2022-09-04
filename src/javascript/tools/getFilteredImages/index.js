import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';

const getFilteredImages = ({ images: stateImages, filtersActiveTags, sortBy, recentImports }) => (
  [...stateImages]
    .map(addSortIndex)
    .sort(sortImages({ sortBy }))
    .map(removeSortIndex)
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
);

export default getFilteredImages;
