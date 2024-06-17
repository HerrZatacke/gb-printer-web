import { useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { RGBNTiles } from 'gb-image-decoder';
import { loadImageTiles } from '../loadImageTiles';
import { compressAndHash, save } from '../storage';
import { Actions } from '../../app/store/actions';
import { State, TypedStore } from '../../app/store/State';
import { Image, MonochromeImage, RGBNHashes, RGBNImage } from '../../../types/Image';
import { isRGBNImage } from '../isRGBNImage';
import { RehashImageAction } from '../../../types/actions/ImageActions';

const reHash = async (state: State, hash: string): Promise<string | null> => {
  const loadedTiles: string[] | RGBNTiles | void = await loadImageTiles(state)(hash, false);

  if (!loadedTiles) {
    return null;
  }

  const { dataHash: newHash } = await compressAndHash(loadedTiles as string[]);

  if (newHash !== hash) {
    return save(loadedTiles as string[]);
  }

  return null;
};

interface UseHashCleanup {
  cleanupBusy: boolean,
  hashCleanup: () => Promise<void>,
}

const useHashCleanup = (): UseHashCleanup => {
  const store: TypedStore = useStore();
  const dispatch = useDispatch();
  const [cleanupBusy, setCleanupBusy] = useState(true);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.enableHashCleanup = () => setCleanupBusy(false);

  return {
    cleanupBusy,
    hashCleanup: async (): Promise<void> => {
      setCleanupBusy(true);
      let iCounterRGBN = 0;
      let iCounterMono = 0;
      const state: State = store.getState();
      const images = state.images;

      const { default: objectHash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

      await Promise.all(images.map(async (image: Image): Promise<void> => {
        const { hash } = image;

        if (isRGBNImage(image)) {
          const { hashes } = image as RGBNImage;
          const keys = Object.keys(hashes) as (keyof RGBNHashes)[];
          const channels: RGBNHashes[] = await Promise.all(
            keys.map(async (key): Promise<RGBNHashes> => {
              const channelHash = hashes[key];
              let newHash: string | null = null;

              if (channelHash) {
                newHash = await reHash(state, channelHash);
              }

              return { [key]: newHash || channelHash };
            }),
          );

          const newHashes: RGBNHashes = channels.reduce((previous: RGBNHashes, current: RGBNHashes): RGBNHashes => ({
            ...previous,
            ...current,
          }), {});

          const newHash = objectHash(newHashes);

          if (newHash !== hash) {
            iCounterRGBN += 1;
            dispatch<RehashImageAction>({
              type: Actions.REHASH_IMAGE,
              payload: {
                oldHash: hash,
                image: {
                  ...image,
                  hash: newHash,
                  hashes: newHashes,
                } as RGBNImage,
              },
            });
          }

        } else {
          const savedHash = await reHash(state, hash);

          if (savedHash) {
            iCounterMono += 1;
            dispatch<RehashImageAction>({
              type: Actions.REHASH_IMAGE,
              payload: {
                oldHash: hash,
                image: {
                  ...image,
                  hash: savedHash,
                } as MonochromeImage,
              },
            });
          }
        }
      }));

      setCleanupBusy(false);
      // eslint-disable-next-line no-console
      console.info({
        iCounterRGBN,
        iCounterMono,
      });
    },
  };
};

export default useHashCleanup;
