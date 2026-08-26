import { getQueryClient } from '@/contexts/QueryClient';
import { deleteBinaryFramesByHashesAction } from '@/stores/items/queries/binaryFrames';
import {
  binaryImageByHashQueryOptions,
  deleteBinaryImagesByHashesAction,
  updateBinaryImagesAction,
} from '@/stores/items/queries/binaryImages';
import applyFrame from '@/tools/applyFrame';
import { deflate, inflate } from '@/tools/pack';
import dummyImage from './dummyImage';

export interface HashedCompressed {
  dataHash: string;
  compressed: string;
}

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
  await updateBinaryImagesAction([{ hash: dataHash, data: compressed }]);
  return dataHash;
};

export const load = async (
  dataHash: string,
  frameHash?: string,
  noDummy?: boolean,
): Promise<string[] | null> => {
  if (!dataHash) {
    return null;
  }

  try {
    const queryClient = getQueryClient();
    const binaryImage = await queryClient.fetchQuery(binaryImageByHashQueryOptions(dataHash));

    if (!binaryImage) {
      throw new Error('missing binary imagedata');
    }

    const inflated = await inflate(binaryImage.data);
    const tiles = inflated.split('\n');
    if (!frameHash) {
      return tiles;
    }

    return applyFrame(tiles, frameHash);
  } catch {
    return noDummy ? [] : dummyImage(dataHash);
  }
};

export const deleteBinaryImage = async (dataHash: string): Promise<void> => {
  await deleteBinaryImagesByHashesAction([dataHash]);
};

export const deleteBinaryFrame = async (dataHash: string): Promise<void> => {
  await deleteBinaryFramesByHashesAction([dataHash]);
};
