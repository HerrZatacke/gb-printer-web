import CollectionsIcon from '@mui/icons-material/Collections';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ExtensionIcon from '@mui/icons-material/Extension';
import FilterIcon from '@mui/icons-material/Filter';
import GradientIcon from '@mui/icons-material/Gradient';
import ImageIcon from '@mui/icons-material/Image';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PaletteIcon from '@mui/icons-material/Palette';
import { ElementType, useMemo } from 'react';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { SheetName, sheetNames } from '@/contexts/GapiSheetStateContext/consts';
import { useItemsStore } from '@/stores/stores';

export interface SheetStats {
  sheetName: SheetName;
  sheetId: string;
  columnCount: string;
  rowCount: string;
  remoteTimestamp: number;
  localTimestamp: number;
  diff: number;
  sort: boolean;
  Icon: ElementType;
}

interface UseGapiSheetsStats {
  sheetsStats: SheetStats[];
  canEnableAutoSync: boolean;
}


const getIcon = (sheeName: SheetName): ElementType => {
  switch (sheeName) {
    case SheetName.IMAGES:
      return ImageIcon;
    case SheetName.RGBN_IMAGES:
      return GradientIcon;
    case SheetName.IMAGE_GROUPS:
      return CollectionsIcon;
    case SheetName.FRAMES:
      return ImageOutlinedIcon;
    case SheetName.FRAME_GROUPS:
      return FilterIcon;
    case SheetName.PALETTES:
      return PaletteIcon;
    case SheetName.PLUGINS:
      return ExtensionIcon;
    case SheetName.BIN_IMAGES:
      return DataObjectIcon;
    case SheetName.BIN_FRAMES:
      return DataObjectIcon;
  }
};


export const useGapiSheetsStats = (): UseGapiSheetsStats => {
  const { gapiLastRemoteUpdates, sheets } = useGapiSheetState();
  const { gapiLastLocalUpdates } = useItemsStore();

  const sheetsStats = useMemo<SheetStats[]>(() => (
    sheetNames.map((sheetName): SheetStats => {
      const properties = sheets.find((sheet) => (sheet.properties?.title === sheetName))?.properties;

      const sheetId = properties?.sheetId?.toString(10) || 'N/A';
      const columnCount = properties?.gridProperties?.columnCount?.toString(10) || 'N/A';
      const rowCount = properties?.gridProperties?.rowCount?.toString(10) || 'N/A';

      const remoteTimestamp = gapiLastRemoteUpdates?.[sheetName] || 0;
      const localTimestamp = gapiLastLocalUpdates?.[sheetName];
      const diff = Math.sign(remoteTimestamp - localTimestamp);
      const sort = sheetName !== SheetName.BIN_IMAGES && sheetName !== SheetName.BIN_FRAMES;
      const Icon = getIcon(sheetName);

      return {
        sheetName,
        sheetId,
        columnCount,
        rowCount,
        remoteTimestamp,
        localTimestamp,
        diff,
        sort,
        Icon,
      };
    })
  ), [gapiLastLocalUpdates, gapiLastRemoteUpdates, sheets]);

  const canEnableAutoSync = useMemo(() => (
    !sheetsStats.find(({ diff, remoteTimestamp, localTimestamp }) => (
      diff !== 0 ||
      !remoteTimestamp ||
      !localTimestamp
    ))
  ), [sheetsStats]);

  return {
    sheetsStats,
    canEnableAutoSync,
  };
};
