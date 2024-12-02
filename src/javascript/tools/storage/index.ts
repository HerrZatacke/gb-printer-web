import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';
import { localforageFrames, localforageImages } from '../localforageInstance';
import { deflate, inflate } from '../pack';

export interface HashedCompressed {
  dataHash: string,
  compressed: string,
}

export type RecoverFn = (hash: string) => void;

export const compressAndHash = async (lines: string[]): Promise<HashedCompressed> => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

  const imageData = lines
    .map((line: string) => (
      line.replace(/ /gi, '').toUpperCase()
    ))
    .join('\n');

  const compressed = await deflate(imageData);

  const dataHash: string = hash(compressed);

  return {
    dataHash,
    compressed,
  };
};

export const save = async (lines: string[]): Promise<string> => {
  const {
    dataHash,
    compressed,
  } = await compressAndHash(lines);
  await localforageImages.setItem(dataHash, compressed);
  return dataHash;
};

export const load = async (
  dataHash: string,
  frameHash?: string,
  noDummy?: boolean,
  recover?: RecoverFn,
): Promise<string[] | null> => {
  if (!dataHash) {
    return null;
  }

  try {
    const binary = await localforageImages.getItem(dataHash);

    if (!binary) {
      throw new Error('missing imagedata');
    }

    const inflated = await inflate(binary);
    const tiles = inflated.split('\n');
    if (!frameHash) {
      return tiles;
    }

    return applyFrame(tiles, frameHash);
  } catch (error) {
    if (typeof recover === 'function') {
      // Recovery function is only used by <ImageRender> component
      // it dispatches so that data might get re-loaded from sync storage
      recover(dataHash);
    }

    return noDummy ? [] : dummyImage(dataHash);
  }
};

export const del = async (dataHash: string): Promise<void> => (
  localforageImages.removeItem(dataHash)
);

export const delFrame = async (dataHash: string): Promise<void> => (
  localforageFrames.removeItem(dataHash)
);
