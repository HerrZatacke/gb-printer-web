import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { localforageFrames } from '../localforageInstance';
import { ExportFrameMode } from '../../consts/exportFrameModes';

export interface FrameData {
  upper: string[],
  left: string[][],
  right: string[][],
  lower: string[],
}

const padCropTiles = (tiles: string[]) => {
  // image too large - cut away the rest
  if (tiles.length > 360) {
    return tiles.slice(0, 360);
  }

  // fill rest of image with content of the last tile.
  if (tiles.length < 360) {
    const lastTile = tiles.pop();
    return [
      ...tiles,
      ...(Array(360 - tiles.length).fill(lastTile)),
    ];
  }

  return tiles;
};

export const compressAndHashFrame = async (lines: string[]) => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  const frameData = padCropTiles([...lines])
    .filter((_, index) => tileIndexIsPartOfFrame(index, ExportFrameMode.FRAMEMODE_KEEP))
    .map((line) => (
      line.replace(/ /gi, '').toUpperCase()
    ))
    .join('\n');

  const compressed = pako.deflate(frameData, {
    strategy: 1,
    level: 8,
  });

  const dataHash = hash(compressed);

  return {
    dataHash,
    compressed,
  };
};

export const saveFrameData = async (lines: string[]): Promise<string> => {
  const {
    dataHash,
    compressed,
  } = await compressAndHashFrame(lines);
  await localforageFrames.setItem(dataHash, compressed);
  return dataHash;
};

export const loadFrameData = async (frameHash: string): Promise<null | FrameData> => {
  if (!frameHash) {
    return null;
  }

  const binary = await localforageFrames.getItem(frameHash);

  if (!binary) {
    return null;
  }

  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  try {
    const tiles = pako.inflate(binary, { to: 'string' }).split('\n');

    return {
      upper: tiles.slice(0, 40),
      left: Array(14).fill(0).map((_, index) => tiles.slice((index * 4) + 40, (index * 4) + 42)),
      right: Array(14).fill(0).map((_, index) => tiles.slice((index * 4) + 42, (index * 4) + 44)),
      lower: tiles.slice(96, 136),
    };
  } catch (error) {
    return null;
  }
};
