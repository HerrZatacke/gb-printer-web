import { ImportMethod } from '@/consts/ImportMethod';
import type { ImportFn } from '@/hooks/useImportExportSettings';
import readFileAs, { ReadAs } from '@/tools/readFileAs';
import type { JSONExport } from '@/types/ExportState';
import { ImportResult } from '@/types/ImportItem';

export const getImportJSON = (importFn: ImportFn) => async (file: File): Promise<ImportResult> => {
  const data = await readFileAs(file, ReadAs.TEXT);
  let settingsDump: JSONExport;

  try {
    settingsDump = JSON.parse(data);
  } catch {
    throw new Error('Not a valid .json file');
  }

  if (!settingsDump?.state) {
    throw new Error('Not a settings .json file');
  }

  importFn(settingsDump);

  return {
    imageCount: settingsDump.state.images?.length || 0,
    importMethod: ImportMethod.JSON,
  };
};
