import generateValueRange from './generateValueRange';

const generateBaseValues = (baseValues: number[]): [number[], number[], number[]] => {
  const a = typeof baseValues[0] === 'number' ? baseValues[0] : 0x00;
  const b = typeof baseValues[1] === 'number' ? baseValues[1] : 0x55;
  const c = typeof baseValues[2] === 'number' ? baseValues[2] : 0xAA;
  const d = typeof baseValues[3] === 'number' ? baseValues[3] : 0xFF;

  return ([
    generateValueRange(a, b),
    generateValueRange(b, c),
    generateValueRange(c, d),
  ]);
};

export default generateBaseValues;
