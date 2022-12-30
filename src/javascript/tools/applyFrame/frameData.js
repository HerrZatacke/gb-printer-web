import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';
import { localforageFrames } from '../localforageInstance';

const padCropTiles = (tiles) => {
  // image too large - cut away the rest
  if (tiles.length > 360) {
    return tiles.slice(0, 360);
  }

  // fill rest of image with content of the last tile.
  if (tiles.length < 360) {
    const lastTile = tiles.pop();
    return [
      ...tiles,
      ...(Array(360 - tiles.length).fill(lastTile)),
    ];
  }

  return tiles;
};

export const compressAndHashFrame = async (lines) => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  const frameData = padCropTiles([...lines])
    .filter((_, index) => tileIndexIsPartOfFrame(index, 'keep'))
    .map((line) => (
      line.replace(/ /gi, '').toUpperCase()
    ))
    .join('\n');

  const compressed = pako.deflate(frameData, {
    to: 'string',
    strategy: 1,
    level: 8,
  });

  const dataHash = hash(compressed);

  return {
    dataHash,
    compressed,
  };
};

export const saveFrameData = async (lines) => {
  const {
    dataHash,
    compressed,
  } = await compressAndHashFrame(lines);
  await localforageFrames.setItem(dataHash, compressed);
  return dataHash;
};

export const loadFrameData = (frameHash) => {
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
