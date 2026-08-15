import {
  type TreeImageGroup,
} from 'gb-printer-schemas';

export const ROOT_ID = 'ROOT';

export const createTreeRoot = (
  topLevelGroups: TreeImageGroup[],
  images: string[],
): TreeImageGroup => ({
  id: ROOT_ID,
  slug: '',
  fullSlug: '',
  created: '',
  title: 'Home',
  isFavourite: false,
  coverImage: null,
  images,
  tags: [...new Set(topLevelGroups.flatMap((group) => group.tags))],
  totalImages: topLevelGroups.reduce((sum, group) => sum + group.totalImages, 0),
  groups: topLevelGroups,
});
