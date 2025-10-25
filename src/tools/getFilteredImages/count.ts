import { TreeImageGroup } from '@/types/ImageGroup';
import type { RecentImport } from '@/types/Sync';
import filterSpecial from './filterSpecial';
import filterTags from './filterTags';

const getFilteredImagesCount = (
  {
    images,
    groups,
  }: TreeImageGroup,
  filtersTags: string[],
  filtersFrames: string[],
  filtersPalettes: string[],
  recentImports: RecentImport[],
): number => (
  [...images]
    .filter(filterSpecial(filtersTags, filtersFrames, filtersPalettes, recentImports, groups))
    .filter(filterTags(filtersTags))
    .length
);

export default getFilteredImagesCount;
