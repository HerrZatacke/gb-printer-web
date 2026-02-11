import { LASTUPDATE_METADATA_KEY } from '@/contexts/GapiSheetStateContext/consts';
import { getRemoteSheetProperties } from '@/contexts/GapiSyncContext/tools/getRemoteSheetProperties';
import { objectsToSheet } from '@/tools/sheetConversion/objectsToSheet';
import { PushOptions, UpdaterOptions } from '@/tools/sheetConversion/types';
import UpdateDeveloperMetadataRequest = gapi.client.sheets.UpdateDeveloperMetadataRequest;
import CreateDeveloperMetadataRequest = gapi.client.sheets.CreateDeveloperMetadataRequest;
import Request = gapi.client.sheets.Request;

export const pushItems = async <T extends object>(
  {
    sheetsClient,
    sheetId,
    merge,
    sheetName,
    columns,
    keyColumn,
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
  } =  await getRemoteSheetProperties(sheetsClient, sheetId, sheetName);

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

  const sheetItems = objectsToSheet(items, {
    key: keyColumn,
    columns,
    deleteMissing: !merge,
    existing: remoteValues,
  });

  // console.log({
  //   items,
  //   sheetName,
  //   remoteValues,
  //   sheetItems,
  // });

  // update Values
  await sheetsClient.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: sheetItems },
  });

  // only headline
  const tableEmpty = sheetItems.length <= 1;

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
    // crop sheet size to sheetItems / delete excess items
    {
      updateSheetProperties: {
        properties: {
          sheetId: targetSheetId,
          gridProperties: {
            // Todo: instead of cropping, maybe delete indices row-by-row? -> More requests, but less network overhead?
            // these dimensions crop the last items if fewer new rows than before
            rowCount: sheetItems.length,
            columnCount: columns.length,
          },
        },
        fields: 'gridProperties(rowCount,columnCount)',
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
            dimensionIndex: 0,
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
        {
          repeatCell: {
            range: {
              sheetId: targetSheetId,
              startColumnIndex: 0,
              endColumnIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.85,
                  green: 0.85,
                  blue: 0.85,
                },
              },
            },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },
      ],
    },
  });

  console.log(`📊 Pushed ${sheetName} in ${Date.now() - startTime}ms`);
};
