import { getFrameFromFullTiles } from '@/tools/getFrameFromFullTiles';
import { localforageFrames } from '@/tools/localforageInstance';
import { deflate, inflate } from '@/tools/pack';
import { reduceItems } from '@/tools/reduceArray';

export interface FrameData {
  upper: string[],
  left: string[][],
  right: string[][],
  lower: string[],
}

export const compressAndHashFrame = async (lines: string[], imageStartLine: number) => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const frameData = JSON.stringify(getFrameFromFullTiles(lines, imageStartLine));

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
  } catch {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    /* frame is not in new format */
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
  } catch {
    return null;
  }
};

export const getAllFrames = async (): Promise<[string, string][]> => {
  const frameHashes = await localforageFrames.keys();

  const allFrames = await Promise.all(frameHashes.map(async (hash): Promise<[string, string] | null> => {
    const frameData = await loadFrameData(hash);

    if (!frameData) {
      return null;
    }

    const data = JSON.stringify(frameData);

    return [hash, data];
  }));

  return allFrames.reduce(reduceItems<[string, string]>, []);
};
