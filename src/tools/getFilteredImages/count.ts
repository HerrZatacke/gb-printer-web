import type { Image } from '@/types/Image';
import type { RecentImport } from '@/types/Sync';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';

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
