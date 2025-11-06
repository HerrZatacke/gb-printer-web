import { ImportMethod } from '@/consts/ImportMethod';
import useImportsStore from '@/stores/importsStore';
import { randomId } from '@/tools/randomId';
import readFileAs, { ReadAs } from '@/tools/readFileAs';
import { compressAndHash } from '@/tools/storage';
import transformCapture from '@/tools/transformCapture';
import transformClassic from '@/tools/transformClassic';
import { ImportResult } from '@/types/ImportItem';

export const transformPlainText = async (file: File): Promise<ImportResult> => {
  const { importQueueAdd } = useImportsStore.getState();
  const data: string = await readFileAs(file, ReadAs.TEXT);
  let result: string[][];

  // file must contain something that resembles a gb printer command
  if (data.indexOf('{"command"') !== -1) {
    result = await transformClassic(data, file.name);
  } else {
    result = await transformCapture(data);
  }

  const imported = await Promise.all(result.map(async (tiles: string[], index: number): Promise<boolean> => {
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

  const imageCount = imported.filter(Boolean).length;

  return {
    imageCount,
    importMethod: ImportMethod.PLAIN_TEXT,
  };
};
