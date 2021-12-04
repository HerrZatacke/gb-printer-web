import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';
import { localforageImages } from '../localforageInstance';

const save = (lines) => (
  import(/* webpackChunkName: "obh" */ 'object-hash')
    .then(({ default: hash }) => (
      import(/* webpackChunkName: "pko" */ 'pako')
        .then(({ default: pako }) => {

          const imageData = lines
            .map((line) => (
              line.replace(/ /gi, '')
            ))
            .join('\n');

          const compressed = pako.deflate(imageData, {
            to: 'string',
            strategy: 1,
            level: 8,
          });

          const dataHash = hash(compressed);
          return localforageImages.setItem(dataHash, compressed)
            .then(() => dataHash);
        })
    ))
);

const load = (dataHash, frameHash, noDummy, recover = false) => {
  if (!dataHash) {
    return Promise.resolve(null);
  }

  return (
    import(/* webpackChunkName: "pko" */ 'pako')
      .then(({ default: pako }) => (
        localforageImages.getItem(dataHash)
          .then((binary) => {
            const inflated = pako.inflate(binary, { to: 'string' });
            return inflated.split('\n');
          })
          .catch(() => {
            if (typeof recover === 'function') {
              // Recovery function is only used by <ImageRender> component
              // it dispatches so that data might get re-loaded from sync storage
              recover(dataHash);
            }

            return noDummy ? [] : dummyImage(dataHash);
          })
      ))
  ).then((tiles) => {
    if (!frameHash) {
      return tiles;
    }

    return applyFrame(tiles, frameHash);
  });
};

const del = (dataHash) => {
  localforageImages.removeItem(dataHash);
};

export {
  save,
  load,
  del,
};
