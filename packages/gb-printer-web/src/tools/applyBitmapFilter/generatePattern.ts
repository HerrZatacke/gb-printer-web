import { GeneratePatternOptions } from '@/types/BitmapFilter';

const generatePattern = ({
  baseValues,
  orderPatterns,
}: GeneratePatternOptions): number[][][] => {
  const pattern: number[][][] = [];

  for (let x = 0; x < 4; x += 1) {
    const xDim: number[][] = [];
    pattern.push(xDim);
    for (let y = 0; y < 4; y += 1) {
      const yDim: number[] = [];
      xDim.push(yDim);
      for (let z = 0; z < 3; z += 1) {
        yDim.push(baseValues[z][orderPatterns[z][(x * 4) + y]]);
      }
    }
  }

  return pattern;
};

export default generatePattern;
