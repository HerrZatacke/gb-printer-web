import filterTags from './filterTags';
import filterSpecial from './filterSpecial';
import type { State } from '../../app/store/State';
import type { Image } from '../../../types/Image';

const getFilteredImagesCount = ({ filtersActiveTags, recentImports }: State, stateImages: Image[]): number => (
  [...stateImages]
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
    .length
);

export default getFilteredImagesCount;
