export enum SpecialTags {
  FILTER_UNTAGGED = '__filter:untagged__',
  FILTER_NEW = '__filter:new__',
  FILTER_MONOCHROME = '__filter:mono__',
  FILTER_RGB = '__filter:rgb__',
  FILTER_RECENT = '__filter:recent__',
  FILTER_FAVOURITE = '__filter:favourite__',
  FILTER_COMMENTS = '__filter:comments__',
  FILTER_USERNAME = '__filter:username__',
}

export const specialTags: string[] = [
  SpecialTags.FILTER_UNTAGGED,
  SpecialTags.FILTER_NEW,
  SpecialTags.FILTER_MONOCHROME,
  SpecialTags.FILTER_RGB,
  SpecialTags.FILTER_RECENT,
  SpecialTags.FILTER_FAVOURITE,
  SpecialTags.FILTER_COMMENTS,
  SpecialTags.FILTER_USERNAME,
];

export const NEW_PALETTE_SHORT = '__new:palette__';
