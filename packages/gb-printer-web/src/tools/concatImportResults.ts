import { nextPowerOfTwo } from '@/tools/nextPowerOfTwo';
import { ImportResult } from '@/types/ImportItem';

export const concatImportResults = (
  importResults: ImportResult[],
  trigger: string,
): umami.EventData => {
  const result: Record<string, number> = {};

  for (const { importMethod, imageCount } of importResults) {
    result[importMethod] = (result[importMethod] ?? 0) + nextPowerOfTwo(imageCount);
  }

  return {
    ...result,
    trigger,
  };
};
