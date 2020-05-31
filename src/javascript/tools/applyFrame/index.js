import int01 from './int/01';
import int02 from './int/02';
import int03 from './int/03';
import int04 from './int/04';
import int05 from './int/05';
import int06 from './int/06';
import int07 from './int/07';
import int08 from './int/08';
import int09 from './int/09';
import int10 from './int/10';
import int16 from './int/16';

const frames = {
  int01,
  int02,
  int03,
  int04,
  int05,
  int06,
  int07,
  int08,
  int09,
  int10,
  int16,
};

const applyFrame = (tiles, which) => {
  const frame = frames[which];
  if (!frame) {
    return tiles;
  }

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
};

export default applyFrame;
