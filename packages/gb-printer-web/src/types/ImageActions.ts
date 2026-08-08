import { type Image, type MonochromeImage } from 'gb-printer-schemas';

export type ImageUpdates =
  Pick<Image, 'title' | 'created' | 'palette' | 'frame' | 'lockFrame' | 'rotation'> &
  Pick<MonochromeImage, 'invertPalette' | 'framePalette' | 'invertFramePalette'>;
