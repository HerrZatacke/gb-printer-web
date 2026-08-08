
export const nextPowerOfTwo = (v: number): number => (
  2 ** Math.ceil(Math.log2(Math.abs(v)))
);
