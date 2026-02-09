import { LASTUPDATE_METADATA_KEY } from '@/contexts/GapiSheetStateContext/consts';
import DeveloperMetadata = gapi.client.sheets.DeveloperMetadata;

export const getLastUpdate = (developerMetadata: DeveloperMetadata[]): number => (
  developerMetadata.reduce((max, item) => {
    if (item.metadataKey !== LASTUPDATE_METADATA_KEY) {
      return max;
    }

    const value = Number(item.metadataValue);
    return value > max ? value : max;
  }, 0)
);
