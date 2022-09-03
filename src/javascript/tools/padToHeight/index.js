
const padToHeight = (tiles) => {
  while (tiles.length < 360) {
    tiles.push(tiles[0]);
    tiles.unshift(tiles[0]);
  }

  return tiles;
};

export default padToHeight;
