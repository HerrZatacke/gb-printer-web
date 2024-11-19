import readFileAs, { ReadAs } from '../readFileAs';
import type { JSONExport, TypedStore } from '../../app/store/State';
import { importExportSettings } from './index';
import type { ReduxState } from '../../app/stores/migrations/history/0/State';

export const getImportJSON = (store: TypedStore) => async (file: File) => {
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

  // Rename property from zustand-migration
  if ((settingsDump.state as ReduxState)?.frameGroupNames) {
    settingsDump.state.frameGroups = (settingsDump.state as ReduxState).frameGroupNames;
    delete (settingsDump.state as Partial<ReduxState>).frameGroupNames;
  }

  const { jsonImport } = importExportSettings(store);

  jsonImport(settingsDump);

  return true;
};
