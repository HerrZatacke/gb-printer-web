export const GalleryClickAction = {
  SELECT: 'select',
  EDIT: 'edit',
  VIEW: 'view',
} as const;
export type GalleryClickAction = (typeof GalleryClickAction)[keyof typeof GalleryClickAction];

