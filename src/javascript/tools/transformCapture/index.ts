import {
  parsePackets,
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
  // ToDo: Types for 'gbp-decode'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

} from 'gbp-decode';

// const lp = (d) => {
//   console.log(d);
//   return d;
// };

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


  // ToDo: Types for 'gbp-decode'
  return parsePackets(bytes)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic);
};

export default transformCapture;
