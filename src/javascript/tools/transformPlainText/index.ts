import readFileAs, { ReadAs } from '../readFileAs';
import transformCapture from '../transformCapture';
import transformClassic from '../transformClassic';
import { compressAndHash } from '../storage';
import { randomId } from '../randomId';
import useImportsStore from '../../app/stores/importsStore';

export const transformPlainText = async (file: File) => {
  const { importQueueAdd } = useImportsStore.getState();
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

    const indexCount = result.length < 2 ? '' : ` ${(index + 1).toString(10)
      .padStart(2, '0')}`;

    importQueueAdd([{
      fileName: `${file.name}${indexCount}`,
      imageHash,
      tiles,
      lastModified: file.lastModified ? (file.lastModified + index) : undefined,
      tempId: randomId(),
    }]);

    return true;
  }));

  return true;
};
