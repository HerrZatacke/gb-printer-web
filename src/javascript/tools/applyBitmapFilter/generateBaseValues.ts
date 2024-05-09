import generateValueRange from './generateValueRange';

const generateBaseValues = ([a, b, c, d]: [number, number, number, number]): [number[], number[], number[]] => ([
  generateValueRange(a, b),
  generateValueRange(b, c),
  generateValueRange(c, d),
]);

export default generateBaseValues;
