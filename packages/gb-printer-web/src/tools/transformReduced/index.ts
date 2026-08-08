import { parsePicoToClassic } from 'gbp-decode';
import { ImportMethod } from '@/consts/ImportMethod';
import { useImportsStore } from '@/stores/stores';
import { randomId } from '@/tools/randomId';
import readFileAs, { ReadAs } from '@/tools/readFileAs';
import { compressAndHash } from '@/tools/storage';
import { ImportResult } from '@/types/ImportItem';

export const transformReduced = async (file: File): Promise<ImportResult> => {
  const { importQueueAdd } = useImportsStore.getState();
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const result: string[][] = await parsePicoToClassic(data);

  const imported = await Promise.all(result.map(async (tiles: string[], index: number) => {
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

  return {
    imageCount: imported.filter(Boolean).length,
    importMethod: ImportMethod.PICO_REDUCED,
  };
};
