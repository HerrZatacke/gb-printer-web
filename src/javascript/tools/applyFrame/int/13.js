const white = '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00';

const upperLower = [...Array(40)].map(() => white);

const leftRight = [...Array(14)].map(() => (
  [...Array(2)].map(() => white)
));

export default {
  upper: upperLower,
  lower: upperLower,
  left: leftRight,
  right: leftRight,
};
