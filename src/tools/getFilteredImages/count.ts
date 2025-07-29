import { TreeImageGroup } from '@/types/ImageGroup';
import type { RecentImport } from '@/types/Sync';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';

const getFilteredImagesCount = (
  {
    images,
    groups,
  }: TreeImageGroup,
  filtersActiveTags: string[],
  recentImports: RecentImport[],
): number => (
  [...images]
    .filter(filterSpecial(filtersActiveTags, recentImports, groups))
    .filter(filterTags(filtersActiveTags))
    .length
);

export default getFilteredImagesCount;
