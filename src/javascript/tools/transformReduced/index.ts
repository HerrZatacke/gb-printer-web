import { parsePicoToClassic } from 'gbp-decode';
import readFileAs, { ReadAs } from '../readFileAs';
import { compressAndHash } from '../storage';
import { Actions } from '../../app/store/actions';
import { randomId } from '../randomId';
import type { TypedStore } from '../../app/store/State';
import type { ImportQueueAddAction } from '../../../types/actions/QueueActions';

const transformReduced = ({ dispatch }: TypedStore) => async (file: File): Promise<boolean> => {
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const result: string[][] = await parsePicoToClassic(data);

  await Promise.all(result.map(async (tiles: string[], index: number) => {
    const { dataHash: imageHash } = await compressAndHash(tiles);

    const indexCount = result.length < 2 ? '' : ` (${index + 1})`;

    dispatch<ImportQueueAddAction>({
      type: Actions.IMPORTQUEUE_ADD,
      payload: {
        fileName: `${file.name}${indexCount}`,
        imageHash,
        tiles,
        lastModified: file.lastModified ? (file.lastModified + index) : undefined,
        tempId: randomId(),
      },
    });

    return true;
  }));

  return true;
};

export default transformReduced;
