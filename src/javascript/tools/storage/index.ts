import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';
import { localforageFrames, localforageImages } from '../localforageInstance';

export interface HashedCompressed {
  dataHash: string,
  compressed: Uint8Array,
}

const compressAndHash = async (lines: string[]): Promise<HashedCompressed> => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  const imageData = lines
    .map((line: string) => (
      line.replace(/ /gi, '').toUpperCase()
    ))
    .join('\n');

  const compressed: Uint8Array = pako.deflate(imageData, {
    strategy: 1,
    level: 8,
  });

  const dataHash: string = hash(compressed);

  return {
    dataHash,
    compressed,
  };
};

const save = async (lines: string[]): Promise<string> => {
  const {
    dataHash,
    compressed,
  } = await compressAndHash(lines);
  await localforageImages.setItem(dataHash, compressed);
  return dataHash;
};

const load = async (
  dataHash: string,
  frameHash: string,
  noDummy: boolean,
  recover?: (hash: string) => void,
): Promise<string[] | null> => {
  if (!dataHash) {
    return null;
  }

  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  try {
    const binary = await localforageImages.getItem(dataHash);

    if (!binary) {
      throw new Error('missing imagedata');
    }

    const inflated = pako.inflate(binary, { to: 'string' });
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

const del = async (dataHash: string): Promise<void> => (
  localforageImages.removeItem(dataHash)
);

const delFrame = async (dataHash: string): Promise<void> => (
  localforageFrames.removeItem(dataHash)
);

export {
  compressAndHash,
  save,
  load,
  del,
  delFrame,
};
