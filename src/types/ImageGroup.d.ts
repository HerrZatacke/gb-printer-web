import type { Image } from './Image';

export interface BaseImageGroup {
  id: string,
  slug: string,
  created: string,
  title: string,
  coverImage: string,
}

/*
* On Type-Changes, a history for migration must be kept in /src/javascript/app/stores/migrations/history/
* */
export interface SerializableImageGroup extends BaseImageGroup {
  groups: string[],
  images: string[],
}

export interface TreeImageGroup extends BaseImageGroup {
  groups: TreeImageGroup[],
  images: Image[],
  tags: string[],
  allImages: Image[],
}
