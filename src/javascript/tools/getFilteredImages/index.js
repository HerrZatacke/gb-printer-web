import sortImages from '../sortImages';
import filter from './filter';

const getFilteredImages = ({ images: stateImages, filter: { activeTags }, sortBy, recentImports }) => (
  [...stateImages].sort(sortImages({ sortBy })).filter(filter(activeTags, recentImports))
);

export default getFilteredImages;
