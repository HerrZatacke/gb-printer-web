import sortImages from '../sortImages';
import filter from './filter';

const getFilteredImages = ({ images: stateImages, filter: { activeTags }, sortBy }) => (
  [...stateImages].sort(sortImages({ sortBy })).filter(filter(activeTags))
);

export default getFilteredImages;
