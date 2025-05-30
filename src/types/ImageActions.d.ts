import type { Image, MonochromeImage } from './Image';

export type ImageUpdates =
  Pick<Image, 'title' | 'created' | 'palette' | 'frame' | 'lockFrame' | 'rotation'> &
  Pick<MonochromeImage, 'invertPalette' | 'framePalette' | 'invertFramePalette'>;
