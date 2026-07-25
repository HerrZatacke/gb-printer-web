import { getQueryClient } from '@/contexts/QueryClient';
import { deleteBinaryFramesByHashesAction } from '@/stores/queries/binaryFrames';
import {
  binaryImageByHashQueryOptions,
  deleteBinaryImagesByHashesAction,
  updateBinaryImagesAction,
} from '@/stores/queries/binaryImages';
import applyFrame from '@/tools/applyFrame';
import { deflate, inflate } from '@/tools/pack';
import dummyImage from './dummyImage';

export interface HashedCompressed {
  dataHash: string;
  compressed: string;
}

export type RecoverFn = (hash: string) => Promise<void>;

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
  await updateBinaryImagesAction(getQueryClient(), [{ hash: dataHash, data: compressed }]);
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
    if (typeof recover === 'function') {
      // Recovery function is only used by <ImageRender> component
      // it dispatches so that data might get re-loaded from sync storage
      await recover(dataHash);
    }

    return noDummy ? [] : dummyImage(dataHash);
  }
};

export const deleteBinaryImage = async (dataHash: string): Promise<void> => {
  await deleteBinaryImagesByHashesAction(getQueryClient(), [dataHash]);
};

export const delFrame = async (dataHash: string): Promise<void> => {
  await deleteBinaryFramesByHashesAction(getQueryClient(), [dataHash]);
};
