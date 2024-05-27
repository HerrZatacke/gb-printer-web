import readFileAs, { ReadAs } from '../readFileAs';
import transformCapture from '../transformCapture';
import transformClassic from '../transformClassic';
import { compressAndHash } from '../storage';
import { compressAndHashFrame } from '../applyFrame/frameData';
import { Actions } from '../../app/store/actions';
import { TypedStore } from '../../app/store/State';
import { ImportQueueAddAction } from '../../../types/actions/QueueActions';
import { randomId } from '../randomId';

const getTransformPlainText = ({ dispatch }: TypedStore) => async (file: File) => {

  const data: string = await readFileAs(file, ReadAs.TEXT);
  let result: string[][];

  // file must contain something that resembles a gb printer command
  if (data.indexOf('{"command"') !== -1) {
    result = await transformClassic(data, file.name);
  } else {
    result = await transformCapture(data);
  }

  await Promise.all(result.map(async (tiles: string[], index: number): Promise<boolean> => {
    const { dataHash: imageHash } = await compressAndHash(tiles);
    const { dataHash: frameHash } = await compressAndHashFrame(tiles);

    const indexCount = result.length < 2 ? '' : ` ${(index + 1).toString(10).padStart(2, '0')}`;

    dispatch<ImportQueueAddAction>({
      type: Actions.IMPORTQUEUE_ADD,
      payload: {
        fileName: `${file.name}${indexCount}`,
        imageHash,
        frameHash,
        tiles,
        lastModified: file.lastModified ? (file.lastModified + index) : undefined,
        tempId: randomId(),
      },
    });

    return true;
  }));

  return true;
};

export default getTransformPlainText;
