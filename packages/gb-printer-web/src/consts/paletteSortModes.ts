export const PaletteSortMode = {
  DEFAULT_ASC:'default_asc',
  DEFAULT_DESC: 'default_desc',
  USAGE_ASC: 'usage_asc',
  USAGE_DESC: 'usage_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
} as const;
export type PaletteSortMode = (typeof PaletteSortMode)[keyof typeof PaletteSortMode];
