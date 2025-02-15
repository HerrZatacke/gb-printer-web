import readFileAs, { ReadAs } from '../readFileAs';
import type { JSONExport } from '../../../types/ExportState';
import type { ImportFn } from '../../hooks/useImportExportSettings';

export const getImportJSON = (importFn: ImportFn) => async (file: File) => {
  const data = await readFileAs(file, ReadAs.TEXT);
  let settingsDump: JSONExport;

  try {
    settingsDump = JSON.parse(data);
  } catch (error) {
    throw new Error('Not a valid .json file');
  }

  if (!settingsDump?.state) {
    throw new Error('Not a settings .json file');
  }

  importFn(settingsDump);

  return true;
};
