import filterTags from './filterTags';
import filterSpecial from './filterSpecial';
import type { RecentImport } from '../../../types/Sync';
import type { Image } from '../../../types/Image';

const getFilteredImagesCount = (
  stateImages: Image[],
  filtersActiveTags: string[],
  recentImports: RecentImport[],
): number => (
  [...stateImages]
    .filter(filterSpecial(filtersActiveTags, recentImports))
    .filter(filterTags(filtersActiveTags))
    .length
);

export default getFilteredImagesCount;
