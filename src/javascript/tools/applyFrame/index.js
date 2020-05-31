import frames from './frames';

const applyFrame = (tiles, which) => {

  const loadFrame = frames[which];
  if (!loadFrame) {
    return Promise.resolve(tiles);
  }

  return loadFrame()
    .then((frame) => {

      const result = [...tiles];

      frame.upper.forEach((tile, index) => {
        result[index] = tile;
      });

      frame.lower.forEach((tile, index) => {
        result[index + 320] = tile;
      });

      frame.left.forEach((frameTiles, index) => {
        result[(20 * index) + 40] = frameTiles[0];
        result[(20 * index) + 41] = frameTiles[1];
      });

      frame.right.forEach((frameTiles, index) => {
        result[(20 * index) + 58] = frameTiles[0];
        result[(20 * index) + 59] = frameTiles[1];
      });

      return result;
    });
};

export default applyFrame;
