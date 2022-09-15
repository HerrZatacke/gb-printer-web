import {
  parseReducedPackets,
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
} from 'gbp-decode';

const transformReduced = (dumpText) => (
  parseReducedPackets(dumpText)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
);

export default transformReduced;
