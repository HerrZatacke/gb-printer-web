import { parseDefaultToClassic } from 'gbp-decode';

const transformCapture = (dumpText: string): string[][] => {

  const bytes: number[] = dumpText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => (
      line.length &&
      line.indexOf('//') !== 0 &&
      line.indexOf('/*') !== 0
    ))
    .map((line) => line.split(' '))
    .flat()
    .map((cc) => parseInt(cc, 16))
    .filter((n) => !isNaN(n));

  return parseDefaultToClassic(bytes);
};

export default transformCapture;
