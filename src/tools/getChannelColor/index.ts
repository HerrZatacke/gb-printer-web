import type { RGBNHashes } from '@/types/Image';

export const getChannelColor = (colorKey: keyof RGBNHashes) => {
  switch (colorKey) {
    case 'r':
      return '#ff0000';
    case 'g':
      return '#00aa00';
    case 'b':
      return '#0000ff';
    case 'n':
    default:
      return '#444444';
  }
};
