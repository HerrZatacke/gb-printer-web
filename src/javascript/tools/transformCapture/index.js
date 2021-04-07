import {
  parsePackets,
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
} from 'gbp-decode';

// const lp = (d) => {
//   console.log(d);
//   return d;
// };

const transformCapture = (dumpText) => {

  const bytes = dumpText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => (
      line.length &&
      line.indexOf('//') !== 0 &&
      line.indexOf('/*') !== 0
    ))
    .map((line) => line.split(' '))
    .flat()
    .map((cc) => parseInt(cc, 16));

  return parsePackets(bytes)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic);
};

export default transformCapture;
