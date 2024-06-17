import filterTags from './filterTags';
import filterSpecial from './filterSpecial';
import type { State } from '../../app/store/State';

const getFilteredImagesCount = ({ images: stateImages, filtersActiveTags, recentImports }: State): number => (
  [...stateImages]
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
    .length
);

export default getFilteredImagesCount;
