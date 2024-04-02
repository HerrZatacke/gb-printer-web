import readFileAs from '../readFileAs';
import transformCapture from '../transformCapture';
import transformClassic from '../transformClassic';
import { compressAndHash } from '../storage';
import { compressAndHashFrame } from '../applyFrame/frameData';
import { Actions } from '../../app/store/actions';

const getTransformPlainText = ({ dispatch }) => async (file) => {

  const data = await readFileAs(file, 'text');
  let result;

  // file must contain something that resembles a gb printer command
  if (data.indexOf('{"command"') !== -1) {
    result = await transformClassic(data, file.name);
  } else {
    result = await transformCapture(data, file.name);
  }

  await Promise.all(result.map(async (tiles, index) => {
    const { dataHash: imageHash } = await compressAndHash(tiles);
    const { dataHash: frameHash } = await compressAndHashFrame(tiles);

    const indexCount = result.length < 2 ? '' : ` ${(index + 1).toString(10).padStart(2, '0')}`;

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

export default getTransformPlainText;
