import filterTags from './filterTags';
import filterSpecial from './filterSpecial';

const getFilteredImagesCount = ({ images: stateImages, filtersActiveTags, recentImports }) => (
  [...stateImages]
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
    .length
);

export default getFilteredImagesCount;
