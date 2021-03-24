import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filter from './filter';

const getFilteredImages = ({ images: stateImages, filter: { activeTags }, sortBy, recentImports }) => (
  [...stateImages]
    .map(addSortIndex)
    .sort(sortImages({ sortBy }))
    .map(removeSortIndex)
    .filter(filter(activeTags, recentImports))
);

export default getFilteredImages;
