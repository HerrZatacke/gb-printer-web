import z from 'zod';

export const SpecialTags = {
  FILTER_UNTAGGED: '__filter:untagged__',
  FILTER_NEW: '__filter:new__',
  FILTER_MONOCHROME: '__filter:mono__',
  FILTER_RGB: '__filter:rgb__',
  FILTER_FAVOURITE: '__filter:favourite__',
  FILTER_COMMENTS: '__filter:comments__',
  FILTER_USERNAME: '__filter:username__',
} as const;
export type SpecialTags = (typeof SpecialTags)[keyof typeof SpecialTags];

export const specialTags: SpecialTags[] = [
  SpecialTags.FILTER_UNTAGGED,
  SpecialTags.FILTER_NEW,
  SpecialTags.FILTER_MONOCHROME,
  SpecialTags.FILTER_RGB,
  SpecialTags.FILTER_FAVOURITE,
  SpecialTags.FILTER_COMMENTS,
  SpecialTags.FILTER_USERNAME,
];

export const NEW_PALETTE_SHORT = '__new:palette__';

export const DAY_MS = 24 * 60 * 60 * 1000;

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export const SortDirectionSchema = z.enum(SortDirection);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

export const ImageSortField = {
  CREATED: 'created',
  FRAME: 'frame',
  PALETTE: 'palette',
  TITLE: 'title',
} as const;
export const ImageSortFieldSchema = z.enum(ImageSortField);
export type ImageSortField = z.infer<typeof ImageSortFieldSchema>;
