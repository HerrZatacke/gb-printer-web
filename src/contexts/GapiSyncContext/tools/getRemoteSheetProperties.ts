import { HASH_COLUMN_NAME } from '@/contexts/GapiSheetStateContext/consts';
import { getSheetColumnRange } from '@/contexts/GapiSyncContext/tools/getSheetColumnRange';
import SheetProperties = gapi.client.sheets.SheetProperties;
import DeveloperMetadata = gapi.client.sheets.DeveloperMetadata;

export enum ColumnRange {
  ALL = 'all',
  HASHES = 'hashes',
}

export interface GetRemoteSheetOptions {
  sheetsClient: typeof gapi.client.sheets;
  spreadsheetId: string;
  sheetName: string;
  columnRange: ColumnRange;
}

export interface RemoteSheetProperties {
  sheetProperties: SheetProperties;
  developerMetadata?: DeveloperMetadata[];
  headers: string[];
  values: string[][];
}


export const getRemoteSheetProperties = async ({
  sheetsClient,
  spreadsheetId,
  sheetName,
  columnRange,
}: GetRemoteSheetOptions): Promise<RemoteSheetProperties> => {
  const { result: { sheets } } = await sheetsClient.spreadsheets.get({
    spreadsheetId,
  });

  const sheet = (sheets || []).find(({ properties }) => (
    properties?.title === sheetName
  ));

  let sheetProperties = sheet?.properties;

  if (!sheetProperties) {
    const { result } = await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    if (!result.replies?.[0]?.addSheet?.properties) {
      throw new Error('Could not create new sheet');
    }

    sheetProperties = result.replies[0]?.addSheet.properties;
  }

  const { result: { matchedDeveloperMetadata } } = await sheetsClient.spreadsheets.developerMetadata.search({
    spreadsheetId,
    resource: {
      dataFilters: [
        {
          developerMetadataLookup: {
            locationType: 'SHEET',
            metadataLocation: {
              sheetId: sheetProperties.sheetId,
            },
          },
        },
      ],
    },
  });

  if (!sheetProperties) {
    throw new Error(`remote sheet "${sheetName}" missing`);
  }

  const { result: { values: headerValues } } = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetProperties.title}!1:1`,
  });

  const headers = headerValues ? headerValues[0] : [];
  const hashHeaderIndex = headers.indexOf(HASH_COLUMN_NAME);
  const resultRange = columnRange === ColumnRange.ALL ? 'A:Z' : getSheetColumnRange(hashHeaderIndex);

  const { result: { values: rangeValues } } = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetProperties.title}!${resultRange}`,
  });

  return {
    sheetProperties,
    developerMetadata: (matchedDeveloperMetadata ||[]).map((metaData) => metaData.developerMetadata).filter(Boolean) as DeveloperMetadata[],
    values: rangeValues || [[]],
    headers,
  };
};
