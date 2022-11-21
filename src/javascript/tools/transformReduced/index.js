import {
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
  parseReducedPackets,
  inflateTransferPackages,
  completeFrame,
} from 'gbp-decode';

const transformReduced = (dumpText) => (
  parseReducedPackets(dumpText)
    .then(inflateTransferPackages)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
    .then(completeFrame)
);

export default transformReduced;
