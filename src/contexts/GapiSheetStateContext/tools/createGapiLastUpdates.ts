import { GapiLastUpdates, sheetNames } from '@/contexts/GapiSheetStateContext/consts';
import { getLastUpdate } from '@/contexts/GapiSheetStateContext/tools/getLastUpdate';
import { getSheetByTitle } from '@/contexts/GapiSheetStateContext/tools/getSheetByTitle';
import Sheet = gapi.client.sheets.Sheet;


export const createGapiLastUpdates = (sheets: Sheet[]): GapiLastUpdates => {
  const getByTitle = getSheetByTitle(sheets);
  const lastUpdates: Partial<GapiLastUpdates> = {};

  for (const name of sheetNames) {
    lastUpdates[name] = getLastUpdate(getByTitle(name)?.developerMetadata || []);
  }

  return lastUpdates as GapiLastUpdates;
};
