import { loadFrameData } from './frameData';

const applyFrame = (tiles, which) => {

  // image must be "default" dimensions
  if (tiles.length !== 360) {
    return Promise.resolve(tiles);
  }

  return loadFrameData(which)
    .then((frameData) => {

      const result = [...tiles];

      frameData.upper.forEach((tile, index) => {
        result[index] = tile;
      });

      frameData.lower.forEach((tile, index) => {
        result[index + 320] = tile;
      });

      frameData.left.forEach((frameTiles, index) => {
        result[(20 * index) + 40] = frameTiles[0];
        result[(20 * index) + 41] = frameTiles[1];
      });

      frameData.right.forEach((frameTiles, index) => {
        result[(20 * index) + 58] = frameTiles[0];
        result[(20 * index) + 59] = frameTiles[1];
      });

      return result;
    })
    .catch(() => tiles);
};

export default applyFrame;
