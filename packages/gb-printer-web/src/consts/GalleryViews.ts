export const GalleryViews = {
  GALLERY_VIEW_SMALL: 'small',
  GALLERY_VIEW_1X: '1x',
  GALLERY_VIEW_2X: '2x',
  GALLERY_VIEW_MAX: 'max',
  PALETTE_VIEW: 'res2x',
} as const;
export type GalleryViews = (typeof GalleryViews)[keyof typeof GalleryViews];
