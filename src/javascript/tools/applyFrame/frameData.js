import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { localforageFrames } from '../localforageInstance';

const saveFrameData = (frameId, imageTiles) => (
  import(/* webpackChunkName: "pko" */ 'pako')
    .then(({ default: pako }) => {
      const frameData = imageTiles
        .filter((_, index) => tileIndexIsPartOfFrame(index))
        .map((line) => (
          line.replace(/ /gi, '')
        ))
        .join('\n');

      const compressed = pako.deflate(frameData, {
        to: 'string',
        strategy: 1,
        level: 8,
      });

      return localforageFrames.setItem(frameId, compressed);
    })
);

const loadFrameData = (frameId) => {
  if (!frameId) {
    return Promise.resolve(null);
  }

  return localforageFrames.getItem(frameId)
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
