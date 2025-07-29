import { Image } from '@/types/Image';
import { type TreeImageGroup } from '@/types/ImageGroup';

export const ROOT_ID = 'ROOT';

export const createTreeRoot = (allImages: Image[]): TreeImageGroup => ({
  id: ROOT_ID,
  slug: '',
  created: '',
  title: 'Home',
  coverImage: '',
  images: [],
  groups: [],
  tags: [],
  allImages,
});
