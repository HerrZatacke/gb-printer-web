import { sheetToObjects } from '@/tools/sheetConversion/sheetToObjects';
import { ColumnSpec } from '@/tools/sheetConversion/types';

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
}): Promise<T[]> => {
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

  console.log(`Pulled ${sheetName} in ${Date.now() - startTime}ms`);

  const importItems = sheetToObjects<T>(updatedValues as string[][], options);

  return importItems;
};
