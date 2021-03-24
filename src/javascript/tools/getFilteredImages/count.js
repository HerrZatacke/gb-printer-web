import filter from './filter';

const getFilteredImagesCount = ({ images: stateImages, filtersActiveTags, recentImports }) => (
  [...stateImages].filter(filter(filtersActiveTags, recentImports)).length
);

export default getFilteredImagesCount;
