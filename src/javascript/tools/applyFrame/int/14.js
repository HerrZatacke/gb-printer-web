const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';

const upperLower = [...Array(40)].map(() => black);

const leftRight = [...Array(14)].map(() => (
  [...Array(2)].map(() => black)
));

export default {
  upper: upperLower,
  lower: upperLower,
  left: leftRight,
  right: leftRight,
};
