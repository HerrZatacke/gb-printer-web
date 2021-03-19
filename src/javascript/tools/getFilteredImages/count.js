import filter from './filter';

const getFilteredImagesCount = ({ images: stateImages, filter: { activeTags }, recentImports }) => (
  [...stateImages].filter(filter(activeTags, recentImports)).length
);

export default getFilteredImagesCount;
