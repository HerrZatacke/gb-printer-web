import { parsePicoToClassic } from 'gbp-decode';
import readFileAs, { ReadAs } from '../readFileAs';
import { compressAndHash } from '../storage';
import { randomId } from '../randomId';
import useImportsStore from '../../app/stores/importsStore';

export const transformReduced = async (file: File): Promise<boolean> => {
  const { importQueueAdd } = useImportsStore.getState();
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const result: string[][] = await parsePicoToClassic(data);

  await Promise.all(result.map(async (tiles: string[], index: number) => {
    const { dataHash: imageHash } = await compressAndHash(tiles);

    const indexCount = result.length < 2 ? '' : ` (${index + 1})`;

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
