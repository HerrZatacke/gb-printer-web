import { LASTUPDATE_METADATA_KEY } from '@/contexts/GapiSheetStateContext/consts';
import { ColumnRange, getRemoteSheetProperties } from '@/contexts/GapiSyncContext/tools/getRemoteSheetProperties';
import { objectsToSheet } from '@/tools/sheetConversion/objectsToSheet';
import { PushOptions, UpdaterOptions } from '@/tools/sheetConversion/types';
import UpdateDeveloperMetadataRequest = gapi.client.sheets.UpdateDeveloperMetadataRequest;
import CreateDeveloperMetadataRequest = gapi.client.sheets.CreateDeveloperMetadataRequest;
import Request = gapi.client.sheets.Request;

export const pushItems = async <T extends object>(
  {
    sheetsClient,
    sheetId,
    sheetName,
    columns,
    newLastUpdateValue,
    sort,
  }: PushOptions & UpdaterOptions<T>,
  items: T[],
): Promise<void> => {
  const startTime = Date.now();

  console.log(`📊 Pushing ${sheetName}`);

  const {
    sheetProperties,
    developerMetadata,
    values: remoteValues,
    headers: remoteHeaders,
  } = await getRemoteSheetProperties({
    sheetsClient,
    spreadsheetId: sheetId,
    sheetName,
    columnRange: ColumnRange.HASHES,
  });

  const lastUpdateMetadataItem = developerMetadata?.find((metadata) => (
    metadata.metadataKey === LASTUPDATE_METADATA_KEY
  ));

  const targetSheetId = sheetProperties.sheetId;

  const metadataUpsertRequest: Request = lastUpdateMetadataItem ? {
    updateDeveloperMetadata: {
      dataFilters: [{
        developerMetadataLookup: {
          metadataId: lastUpdateMetadataItem.metadataId,
        },
      }],
      developerMetadata: {
        metadataValue: newLastUpdateValue.toString(10),
      },
      fields: 'metadataValue',
    } as UpdateDeveloperMetadataRequest,
  } : {
    createDeveloperMetadata: {
      developerMetadata: {
        metadataKey: LASTUPDATE_METADATA_KEY,
        metadataValue: newLastUpdateValue.toString(10),
        visibility: 'DOCUMENT',
        location: {
          sheetId: targetSheetId,
        },
      },
    } as CreateDeveloperMetadataRequest,
  };

  const [, ...remoteHashesRows] = remoteValues;
  const remoteHashes = remoteHashesRows.map(([col1]) => col1);

  const {
    sheetHeaders,
    deleteIndices,
    newSheetItems,
    keyIndex,
  } = await objectsToSheet(items, {
    columns,
    remoteHashes,
    remoteHeaders,
  });

  // Create delete requests
  const dimensionRequests: Request[] = deleteIndices.map((deleteIndex) => ({
    deleteDimension: {
      range: {
        sheetId: targetSheetId,
        dimension: 'ROWS',
        startIndex: deleteIndex + 1, // zero-indexed, but headline row=0th
        endIndex: deleteIndex + 2,
      },
    },
  }));

  // if needed, make room for new sheet items
  if (newSheetItems.length) {
    dimensionRequests.push({
      insertDimension: {
        range: {
          sheetId: targetSheetId,
          dimension: 'ROWS',
          startIndex: 1, // zero-indexed, but headline row=0th
          endIndex: newSheetItems.length + 1,
        },
        inheritFromBefore: true,
      },
    });
  }

  // if the first (data-)row must be deleted, possibly unfreeze table header first
  // ToDo: check if really !ALL! rows would be deleted
  if (deleteIndices.includes(0)) {
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: targetSheetId,
                gridProperties: {
                  frozenRowCount: 0,
                },
              },
              fields: 'gridProperties.frozenRowCount',
            },
          },
        ],
      },
    });
  }


  if (dimensionRequests.length) {
    // unfreeze table header to possibly allow to delete all rows

    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: dimensionRequests,
      },
    });
  }

  const values: string[][] = [
    sheetHeaders,
    ...newSheetItems,
  ];

  const chunkSize = 400;

  // update values in chunks
  for (let startRow = 0; startRow < values.length; startRow += chunkSize) {
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${startRow + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values.slice(startRow, startRow + chunkSize),
      },
    });

    await new Promise((resolve) => window.setTimeout(resolve, 1000));
  }


  // only headline
  const tableEmpty = items.length === 0;

  // requests must be separate, to prevent failure when emptying table
  const resizeRequests: Request[] = [
    // set fixed header row
    {
      updateSheetProperties: {
        properties: {
          sheetId: targetSheetId,
          gridProperties: {
            frozenRowCount: tableEmpty ? 0 : 1,
          },
        },
        fields: 'gridProperties.frozenRowCount',
      },
    },
  ];

  // don't sort an empty table
  const sortRequest: Request[] = (sort && !tableEmpty) ? [
    {
      sortRange: {
        range: {
          sheetId: targetSheetId,
          startRowIndex: 1,
          startColumnIndex: 0,
        },
        sortSpecs: [
          {
            dimensionIndex: keyIndex,
            sortOrder: 'ASCENDING',
          },
        ],
      },
    },
  ] : [];

  await sheetsClient.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: [
        ...resizeRequests,
        ...sortRequest,
        metadataUpsertRequest,
      ],
    },
  });

  console.log(`📊 Pushed ${sheetName} in ${Date.now() - startTime}ms`);
};
