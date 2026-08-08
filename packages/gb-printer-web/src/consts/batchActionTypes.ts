import { type MonochromeImage, type Image } from '@/types/Image';

export const BatchActionType = {
  DELETE: 'delete',
  ANIMATE: 'animate',
  DOWNLOAD: 'download',
  EDIT: 'edit',
  RGB: 'rgb',
} as const;
export type BatchActionType = (typeof BatchActionType)[keyof typeof BatchActionType];

export const Updatable = {
  LOCK_FRAME: 'lockFrame',
  FRAME: 'frame',
  PALETTE: 'palette',
  TITLE: 'title',
  TAGS: 'tags',
  CREATED: 'created',
  ROTATION: 'rotation',
} as const;
export type Updatable = (typeof Updatable)[keyof typeof Updatable];

export const UpdatableMonochrome = {
  INVERT_PALETTE: 'invertPalette',
  FRAME_PALETTE: 'framePalette',
  INVERT_FRAME_PALETTE: 'invertFramePalette',
} as const;
export type UpdatableMonochrome = (typeof UpdatableMonochrome)[keyof typeof UpdatableMonochrome];

export type ImageUpdatable = (keyof Image | keyof MonochromeImage);

export const UPDATATABLES: ImageUpdatable[] = [
  Updatable.LOCK_FRAME,
  Updatable.FRAME,
  Updatable.TITLE,
  Updatable.TAGS,
  Updatable.CREATED,
  Updatable.ROTATION,
  Updatable.PALETTE,
  UpdatableMonochrome.INVERT_PALETTE,
  UpdatableMonochrome.FRAME_PALETTE,
  UpdatableMonochrome.INVERT_FRAME_PALETTE,
];
