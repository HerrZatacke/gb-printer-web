// noinspection JSBitwiseOperatorUsage
const isPowerOfTwo = (v) => (
  // eslint-disable-next-line no-bitwise
  v && !(v & (v - 1))
);

const isGoodScaleFactor = (scaleFactor) => (
  Math.floor(scaleFactor) === scaleFactor &&
  isPowerOfTwo(scaleFactor)
);

export default isGoodScaleFactor;
