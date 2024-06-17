import type { Image } from '../../../../../types/Image';

export enum Updatable {
  LOCK_FRAME = 'lockFrame',
  FRAME = 'frame',
  PALETTE = 'palette',
  INVERT_PALETTE = 'invertPalette',
  TITLE = 'title',
  TAGS = 'tags',
  CREATED = 'created',
  ROTATION = 'rotation'
}

export const UPDATATABLES: (keyof Image)[] = [
  Updatable.LOCK_FRAME,
  Updatable.FRAME,
  Updatable.PALETTE,
  Updatable.INVERT_PALETTE,
  Updatable.TITLE,
  Updatable.TAGS,
  Updatable.CREATED,
  Updatable.ROTATION,
];
