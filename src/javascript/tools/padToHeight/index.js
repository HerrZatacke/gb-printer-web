
const padToHeight = (tiles) => {
  const pad = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';

  // Fill up to a full line
  while (tiles.length % 20) {
    tiles.push(pad);
  }

  const padLine = (new Array(20)).fill(pad);

  // eslint-disable-next-line
  while (tiles.length < 360) {
    tiles.push(...padLine);

    if (tiles.length < 360) {
      tiles.unshift(...padLine);
    }
  }

  return tiles;
};

export default padToHeight;
