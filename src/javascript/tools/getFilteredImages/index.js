import { addSortIndex, removeSortIndex, sortImages } from '../sortImages';
import filter from './filter';
import { getAvailableTags } from '../../hooks/useAvailableTags';

// eslint-disable-next-line arrow-body-style
const getFilteredImages = ({ images: stateImages, filtersActiveTags, sortBy, recentImports }) => {

  const availableTags = getAvailableTags(stateImages);
  const filterTags = filtersActiveTags.filter((tag) => availableTags.includes(tag));

  return (
    [...stateImages]
      .map(addSortIndex)
      .sort(sortImages({ sortBy }))
      .map(removeSortIndex)
      .filter(filter(filterTags, recentImports))
  );
};

export default getFilteredImages;
