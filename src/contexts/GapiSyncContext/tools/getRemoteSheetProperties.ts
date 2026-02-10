import SheetProperties = gapi.client.sheets.SheetProperties;
import DeveloperMetadata = gapi.client.sheets.DeveloperMetadata;

export interface RemoteSheetProperties {
  sheetProperties: SheetProperties;
  developerMetadata?: DeveloperMetadata[];
  values: string[][];
}

export const getRemoteSheetProperties = async (sheetsClient: typeof gapi.client.sheets, spreadsheetId: string, sheetName: string): Promise<RemoteSheetProperties> => {
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

  const { result: { values } } = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetProperties.title}!A:Z`,
  });

  return {
    sheetProperties,
    developerMetadata: (matchedDeveloperMetadata ||[]).map((metaData) => metaData.developerMetadata).filter(Boolean) as DeveloperMetadata[],
    values: values || [[]],
  };
};
