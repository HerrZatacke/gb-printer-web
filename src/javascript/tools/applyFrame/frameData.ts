import { ExportFrameMode, tileIndexIsPartOfFrame } from 'gb-image-decoder';
import { localforageFrames } from '../localforageInstance';
import { deflate, inflate } from '../pack';
import { wildDummy } from './wildDummy';
import { getFrameFromFullTiles } from '../getFrameFromFullTiles';

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

export const compressAndHashFrame = async (lines: string[], imageStartLine: number) => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

  // const frameData = padCropTiles([...lines])
  //   .filter((_, index) => tileIndexIsPartOfFrame(index, ExportFrameMode.FRAMEMODE_KEEP))
  //   .map((line) => (
  //     line.replace(/ /gi, '').toUpperCase()
  //   ))
  //   .join('\n');

  const frameData = JSON.stringify(getFrameFromFullTiles(lines, imageStartLine));

  console.log({ frameData });

  const compressed = await deflate(frameData);
  const dataHash = hash(compressed);

  return {
    dataHash,
    compressed,
  };
};

export const saveFrameData = async (lines: string[], imageStartLine: number): Promise<string> => {
  const {
    dataHash,
    compressed,
  } = await compressAndHashFrame(lines, imageStartLine);
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

  let raw;

  try {
    raw = await inflate(binary);
  } catch (error) {
    return null;
  }

  try {
    const fd = JSON.parse(raw);
    console.log({ fd });
    return fd;
  } catch (error) {
    console.log('rawData is not in JSON format');

    // return wildDummy;
    /* */
  }

  try {
    const tiles = raw.split('\n');

    // "older format" where framedata is stored as a string of tiles without containing the non-frame tiles
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
