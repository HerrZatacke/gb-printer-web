import { ROOT_ID } from '@/tools/createTreeRoot';
import {
  type NewTreeImageGroup,
} from '@/types/ImageGroup';

export const createTreeRoot = (
  topLevelGroups: NewTreeImageGroup[],
  images: string[],
): NewTreeImageGroup => ({
  id: ROOT_ID,
  slug: '',
  created: '',
  title: 'Home',
  isFavourite: false,
  coverImage: '',
  images,
  tags: [...new Set(topLevelGroups.flatMap((group) => group.tags))],
  totalImages: topLevelGroups.reduce((sum, group) => sum + group.totalImages, 0),
  groups: topLevelGroups,
});
