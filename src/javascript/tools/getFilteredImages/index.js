import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filter from './filter';

const getFilteredImages = ({ images: stateImages, filtersActiveTags, sortBy, recentImports }) => (
  [...stateImages]
    .map(addSortIndex)
    .sort(sortImages({ sortBy }))
    .map(removeSortIndex)
    .filter(filter(filtersActiveTags, recentImports))
);

export default getFilteredImages;
