import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { localforageFrames } from '../localforageInstance';

const saveFrameData = (imageTiles) => (
  import(/* webpackChunkName: "obh" */ 'object-hash')
    .then(({ default: hash }) => (
      import(/* webpackChunkName: "pko" */ 'pako')
        .then(({ default: pako }) => {
          const frameData = imageTiles
            .filter((_, index) => tileIndexIsPartOfFrame(index, 'keep'))
            .map((line) => (
              line.replace(/ /gi, '')
            ))
            .join('\n');

          const compressed = pako.deflate(frameData, {
            to: 'string',
            strategy: 1,
            level: 8,
          });

          const dataHash = hash(compressed);

          return localforageFrames.setItem(dataHash, compressed)
            .then(() => dataHash);
        })
    ))
);

const loadFrameData = (frameHash) => {
  if (!frameHash) {
    return Promise.resolve(null);
  }

  return localforageFrames.getItem(frameHash)
    .then((binary) => {
      if (!binary) {
        return null;
      }

      return import(/* webpackChunkName: "pko" */ 'pako')
        .then(({ default: pako }) => {
          try {
            const tiles = pako.inflate(binary, { to: 'string' }).split('\n');

            return {
              upper: tiles.slice(0, 40),
              left: Array(14).fill(0).map((_, index) => tiles.slice((index * 4) + 40, (index * 4) + 42)),
              right: Array(14).fill(0).map((_, index) => tiles.slice((index * 4) + 42, (index * 4) + 44)),
              lower: tiles.slice(96, 136),
            };
          } catch (error) {
            return null;
          }
        });
    });

};

export {
  loadFrameData,
  saveFrameData,
};
