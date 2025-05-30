import type { MonochromeImage, Image } from '@/types/Image';

export enum BatchActionType {
  DELETE = 'delete',
  ANIMATE = 'animate',
  DOWNLOAD = 'download',
  EDIT = 'edit',
  RGB = 'rgb',
}

export enum Updatable {
  LOCK_FRAME = 'lockFrame',
  FRAME = 'frame',
  PALETTE = 'palette',
  TITLE = 'title',
  TAGS = 'tags',
  CREATED = 'created',
  ROTATION = 'rotation'
}

export enum UpdatableMonochrome {
  INVERT_PALETTE = 'invertPalette',
  FRAME_PALETTE = 'framePalette',
  INVERT_FRAME_PALETTE = 'invertFramePalette',
}

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
