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

  const start = Date.now();

  const {
    sheetItems,
    keyIndex,
  } = await objectsToSheet(items, {
    columns,
    deleteMissing: !merge,
    existing: remoteValues,
  });

  console.log(`Created and hashed sheet with ${sheetItems.length} items in ${Date.now() - start}ms`);
  console.log(sheetItems.slice(0, 2));
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
            columnCount: sheetItems[0].length,
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
