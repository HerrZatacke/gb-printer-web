// noinspection JSBitwiseOperatorUsage
const isPowerOfTwo = (v: number): boolean => (
  // eslint-disable-next-line no-bitwise
  Boolean(v && !(v & (v - 1)))
);

const isGoodScaleFactor = (scaleFactor: number): boolean => (
  Math.floor(scaleFactor) === scaleFactor &&
  isPowerOfTwo(scaleFactor)
);

export default isGoodScaleFactor;
