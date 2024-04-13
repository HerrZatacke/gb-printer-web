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
import readFileAs from '../readFileAs';
import { compressAndHash } from '../storage';
import { compressAndHashFrame } from '../applyFrame/frameData';
import { Actions } from '../../app/store/actions';

const transformReduced = ({ dispatch }) => async (file) => {
  const data = await readFileAs(file, 'uint8array');

  const result = await parseReducedPackets(data)
    .then(inflateTransferPackages)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
    .then(completeFrame);

  await Promise.all(result.map(async (tiles, index) => {
    const { dataHash: imageHash } = await compressAndHash(tiles);
    const { dataHash: frameHash } = await compressAndHashFrame(tiles);

    const indexCount = result.length < 2 ? '' : ` (${index + 1})`;

    dispatch({
      type: Actions.IMPORTQUEUE_ADD,
      payload: {
        fileName: `${file.name}${indexCount}`,
        imageHash,
        frameHash,
        tiles,
        lastModified: file.lastModified ? (file.lastModified + index) : null,
        tempId: Math.random().toString(16).split('.').pop(),
      },
    });

    return true;
  }));

  return true;
};

export default transformReduced;
