import { useDispatch, useStore } from 'react-redux';
import { useState } from 'react';
import loadImageTiles from '../loadImageTiles';
import { compressAndHash, save } from '../storage';
import { REHASH_IMAGE } from '../../app/store/actions';

const reHash = async (state, hash) => {
  const loadedTiles = await loadImageTiles(state)({ hash }, false, true);

  const { dataHash: newHash } = await compressAndHash(loadedTiles);

  if (newHash !== hash) {
    return save(loadedTiles);
  }

  return null;
};

const useHashCleanup = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const [cleanupBusy, setCleanupBusy] = useState(true);

  window.enableHashCleanup = () => setCleanupBusy(false);

  return {
    cleanupBusy,
    hashCleanup: async () => {
      setCleanupBusy(true);
      let iCounterRGBN = 0;
      let iCounterMono = 0;
      const state = store.getState();

      const { default: objectHash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

      await Promise.all(store.getState().images.map(async (image) => {
        const { hash, hashes } = image;

        if (hashes) {
          const channels = await Promise.all(Object.keys(hashes).map(async (key) => {
            const channelHash = hashes[key];
            let newHash = null;

            if (channelHash) {
              newHash = await reHash(state, channelHash);
            }

            return { [key]: newHash || channelHash };
          }));

          const newHashes = channels.reduce((previous, current) => ({
            ...previous,
            ...current,
          }), {});

          const newHash = objectHash(newHashes);

          if (newHash !== hash) {
            iCounterRGBN += 1;
            dispatch({
              type: REHASH_IMAGE,
              payload: {
                oldHash: hash,
                image: {
                  ...image,
                  hash: newHash,
                  hashes: newHashes,
                },
              },
            });
          }

        } else {
          const savedHash = await reHash(state, hash);

          if (savedHash) {
            iCounterMono += 1;
            dispatch({
              type: REHASH_IMAGE,
              payload: {
                oldHash: hash,
                image: {
                  ...image,
                  hash: savedHash,
                },
              },
            });
          }
        }
      }));

      setCleanupBusy(false);
      console.info({
        iCounterRGBN,
        iCounterMono,
      });
    },
  };
};

export default useHashCleanup;
