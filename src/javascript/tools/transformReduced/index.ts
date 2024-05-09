import {
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
  parseReducedPackets,
  inflateTransferPackages,
  completeFrame,
  // ToDo: Types for 'gbp-decode'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from 'gbp-decode';
import readFileAs, { ReadAs } from '../readFileAs';
import { compressAndHash } from '../storage';
import { compressAndHashFrame } from '../applyFrame/frameData';
import { Actions } from '../../app/store/actions';
import { TypedStore } from '../../app/store/State';

const transformReduced = ({ dispatch }: TypedStore) => async (file: File): Promise<boolean> => {
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  // ToDo: Types for 'gbp-decode'
  const result: string[][] = await parseReducedPackets(data)
    .then(inflateTransferPackages)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
    .then(completeFrame);

  await Promise.all(result.map(async (tiles: string[], index: number) => {
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
