import type { Image } from './Image';

export interface BaseImageGroup {
  id: string,
  slug: string,
  created: string,
  title: string,
  coverImage: string,
}

export interface SerializableImageGroup extends BaseImageGroup {
  groups: string[],
  images: string[],
}

export interface TreeImageGroup extends BaseImageGroup {
  groups: TreeImageGroup[],
  images: Image[],
}
