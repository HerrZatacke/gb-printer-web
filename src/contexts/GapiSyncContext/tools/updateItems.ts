import { LASTUPDATE_METADATA_KEY } from '@/contexts/GapiSheetStateContext/consts';
import { getRemoteSheetProperties } from '@/contexts/GapiSyncContext/tools/getRemoteSheetProperties';
import { objectsToSheet } from '@/tools/sheetConversion/objectsToSheet';
import { sheetToObjects } from '@/tools/sheetConversion/sheetToObjects';
import { ColumnSpec } from '@/tools/sheetConversion/types';
import UpdateDeveloperMetadataRequest = gapi.client.sheets.UpdateDeveloperMetadataRequest;
import CreateDeveloperMetadataRequest = gapi.client.sheets.CreateDeveloperMetadataRequest;
import Request = gapi.client.sheets.Request;

export const updateItems = async <T extends object>({
  sheetsClient,
  sheetId,
  sheetName,
  columns,
  keyColumn,
  items,
  newLastUpdateValue,
  updateFn,
}: {
  sheetsClient: typeof gapi.client.sheets;
  sheetId: string;
  sheetName: string;
  columns: ColumnSpec<T>[];
  keyColumn: keyof T;
  items: T[];
  newLastUpdateValue: number;
  updateFn: (items: T[]) => void;
}): Promise<void> => {
  const startTime = Date.now();

  const options = {
    key: keyColumn,
    columns,
  };

  const {
    sheetProperties,
    developerMetadata,
    values: remoteValues,
  } =  await getRemoteSheetProperties(sheetsClient, sheetId, sheetName);

  const lastUpdateMetadataItem = developerMetadata?.find((metadata) => (
    metadata.metadataKey === LASTUPDATE_METADATA_KEY
  ));

  const targetSheetId = sheetProperties.sheetId;

  console.log({ metadataId: lastUpdateMetadataItem?.metadataId });

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

  console.log({ newLastUpdateValue, metadataUpsertRequest });

  const sheetItems = objectsToSheet(items, {
    ...options,
    deleteMissing: true,
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

  // update sheet properties:
  // fix header row
  // crop sheet size to sheetItems to delete excess items
  await sheetsClient.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: targetSheetId,
              gridProperties: {
                frozenRowCount: 1,
                // Todo: instead of cropping, maybe delete indices row-by-row? -> More requests, but less network overhead?
                // these dimensions crop the last items if fewer new rows than before
                rowCount: sheetItems.length + 1,
                columnCount: columns.length,
              },
            },
            fields: 'gridProperties(rowCount,columnCount,frozenRowCount)',
          },
        },
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
        metadataUpsertRequest,
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: targetSheetId,
              dimension: 'COLUMNS',
            },
          },
        },
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

  console.log(`Pushed ${sheetName} in ${Date.now() - startTime}ms`);

  // Update
  const { result: { values: updatedValues } } = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:Z`,
  });
  const importItems = sheetToObjects<T>(updatedValues as string[][], options);
  updateFn(importItems);
};
