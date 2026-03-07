import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import { ColumnRange, getRemoteSheetProperties } from '@/contexts/GapiSyncContext/tools/getRemoteSheetProperties';

export interface RecoverImagesOptions {
  sheetsClient: typeof gapi.client.sheets;
  spreadsheetId: string;
  hashes: string[];
}

interface GetImageBinQuery {
  hash: string;
  rowIndex: string;
}

interface ResolvedImageBin {
  hash: string;
  imageData: string;
}

export const getBinImagesByHashes = async ({
  sheetsClient,
  spreadsheetId,
  hashes,
}: RecoverImagesOptions): Promise<ResolvedImageBin[]> => {
  const dataColumnHeader = 'Data';
  const idColumnHeader = 'hash';

  const properties = await getRemoteSheetProperties({
    sheetsClient,
    spreadsheetId,
    sheetName: SheetName.BIN_IMAGES,
    columnRange: ColumnRange.SPECIFIC_COLUMN,
    specificColumnHeader: idColumnHeader,
  });

  const queryRanges = hashes
    .map((hash): GetImageBinQuery | null => {
      const rowIndex = properties.values.findIndex((valueRow) => valueRow[0] === hash) + 1;

      if (!rowIndex) {
        return null;
      }

      return {
        hash,
        rowIndex: `${SheetName.BIN_IMAGES}!A${rowIndex}:Z${rowIndex}`,
      };
    })
    .filter(Boolean) as GetImageBinQuery[];

  console.log({ hashes, queryRanges });

  const dataColumnHeaderIndex = properties.headers.findIndex((header) => (header === dataColumnHeader));

  if (dataColumnHeaderIndex === -1) {
    throw new Error(`'${dataColumnHeader}' header not found`);
  }

  const rawDatas: ResolvedImageBin[] = (await Promise.all(queryRanges.map(async ({ hash, rowIndex }): Promise<ResolvedImageBin | null> => {
    const { result: { values } } = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: rowIndex,
    });

    try {
      return {
        hash,
        imageData: atob(values?.[0][dataColumnHeaderIndex]),
      };
    } catch {
      return null;
    }
  })))
    .filter(Boolean) as ResolvedImageBin[];

  return rawDatas;
};
