import generateValueRange from './generateValueRange.mjs';

const generateBaseValues = ([a, b, c, d]) => {
  return ([
    generateValueRange(a, b),
    generateValueRange(b, c),
    generateValueRange(c, d),
  ]);
};

export default generateBaseValues;
