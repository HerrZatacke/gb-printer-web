import filter from './filter';

const getFilteredImagesCount = ({ images: stateImages, filter: { activeTags } }) => (
  [...stateImages].filter(filter(activeTags)).length
);

export default getFilteredImagesCount;
