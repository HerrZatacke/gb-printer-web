export interface BaseImageGroup {
  id: string,
  created: string,
  title: string,
  coverImage: string,
  images: string[],
}

export interface SerializableImageGroup extends BaseImageGroup {
  groups: string[],
}

export interface TreeImageGroup extends BaseImageGroup {
  groups: TreeImageGroup[],
}
