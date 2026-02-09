import { getRemoteSheetProperties, type RemoteSheetProperties } from '@/contexts/GapiSyncContext/tools/getRemoteSheetProperties';
import { sheetToObjects } from '@/tools/sheetConversion/sheetToObjects';
import { ColumnSpec } from '@/tools/sheetConversion/types';

interface PullItemsResult<T> {
  items: T[];
  sheetProperties: RemoteSheetProperties;
}

export const pullItems = async <T extends object>({
  sheetsClient,
  sheetId,
  sheetName,
  columns,
  keyColumn,
}: {
  sheetsClient: typeof gapi.client.sheets;
  sheetId: string;
  sheetName: string;
  columns: ColumnSpec<T>[];
  keyColumn: keyof T;
}): Promise<PullItemsResult<T>> => {
  const startTime = Date.now();

  const options = {
    key: keyColumn,
    columns,
  };

  // Update
  const { result: { values: updatedValues } } = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:Z`,
  });

  const sheetProperties = await getRemoteSheetProperties(sheetsClient, sheetId, sheetName);

  console.log(`Pulled ${sheetName} in ${Date.now() - startTime}ms`);

  const items = sheetToObjects<T>(updatedValues as string[][], options);

  return {
    items,
    sheetProperties,
  };
};
