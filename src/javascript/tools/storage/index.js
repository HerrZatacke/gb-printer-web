import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';
import { localforageImages } from '../localforageInstance';

const save = (lineBuffer) => (
  import(/* webpackChunkName: "obh" */ 'object-hash')
    .then(({ default: hash }) => (
      import(/* webpackChunkName: "pko" */ 'pako')
        .then(({ default: pako }) => {

          const imageData = lineBuffer
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

const load = (dataHash, frame, noDummy) => {
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
          .catch(() => (
            noDummy ? [] : dummyImage(dataHash)
          ))
      ))
  ).then((tiles) => {
    if (!frame) {
      return tiles;
    }

    return applyFrame(tiles, frame);
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
