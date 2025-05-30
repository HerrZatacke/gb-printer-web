import { ExportFrameMode, tileIndexIsPartOfFrame } from 'gb-image-decoder';
import { loadFrameData } from './frameData';

const applyFrame = async (tiles: string[], frameHash: string): Promise<string[]> => {

  // image must be "default" dimensions
  if (tiles.length !== 360) {
    return tiles;
  }

  const frameData = await loadFrameData(frameHash);

  if (!frameData) {
    return tiles;
  }

  if (frameData.left.length !== 14 || frameData.right.length !== 14) {
    console.error('Invalid frameData');
    return tiles;
  }

  const unframedImage: string[] = tiles.reduce((acc: string[], tile: string, index: number): string[] => (
    tileIndexIsPartOfFrame(index, 2, ExportFrameMode.FRAMEMODE_KEEP) ? acc : [...acc, tile]
  ), []);

  const result: string[] = [...frameData.upper];

  for (let line = 0; line < 14; line += 1) {
    result.push(...frameData.left[line], ...unframedImage.slice(line * 16, (line + 1) * 16), ...frameData.right[line]);
  }

  result.push(...frameData.lower);

  return result;
};

export default applyFrame;
