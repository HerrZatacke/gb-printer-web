import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
import Sheet = gapi.client.sheets.Sheet;

export const getSheetByTitle = (sheets: Sheet[]) => (title: SheetName): Sheet | null => (
  sheets.find(({ properties }) => (properties?.title === title)) || null
);
