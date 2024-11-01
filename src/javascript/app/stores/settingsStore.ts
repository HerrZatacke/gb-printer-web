import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ExportFrameMode } from 'gb-image-decoder';
import dayjs from 'dayjs';
import { PROJECT_PREFIX } from './constants';
import cleanUrl from '../../tools/cleanUrl';
import dateFormatLocale from '../../tools/dateFormatLocale';
import { PaletteSortMode } from '../../consts/paletteSortModes';

interface Values {
  enableDebug: boolean,
  exportFileTypes: string[],
  exportScaleFactors: number[],
  forceMagicCheck: boolean,
  handleExportFrame: ExportFrameMode,
  hideDates: boolean,
  importDeleted: boolean,
  importLastSeen: boolean,
  importPad: boolean,
  pageSize: number,
  preferredLocale: string,
  printerParams: string,
  printerUrl: string,
  savFrameTypes: string,
  enableImageGroups: boolean,
  sortPalettes: PaletteSortMode,
}

interface Actions {
  setEnableDebug: (enableDebug: boolean) => void,
  setExportFileTypes: (updateFileType: string, checked: boolean) => void,
  setExportScaleFactors: (factor: number, checked: boolean) => void
  setForceMagicCheck: (forceMagicCheck: boolean) => void,
  setHandleExportFrame: (handleExportFrame: ExportFrameMode) => void,
  setHideDates: (hideDates: boolean) => void,
  setImportDeleted: (importDeleted: boolean) => void,
  setImportLastSeen: (importLastSeen: boolean) => void,
  setImportPad: (importPad: boolean) => void,
  setPageSize: (pageSize: number) => void
  setPreferredLocale: (preferredLocale: string) => void,
  setPrinterParams: (printerParams: string) => void,
  setPrinterUrl: (printerUrl: string) => void,
  setSavFrameTypes: (savFrameTypes: string) => void,
  setEnableImageGroups: (enableImageGroups: boolean) => void,
  setSortPalettes: (sortPalettes: PaletteSortMode) => void,
}

export type SettingsState = Values & Actions;

const getDefaultLocale = (): string => {
  const [lang, country] = navigator.language.split('-');
  return [lang, country].filter(Boolean).join('-');
};

const useSettingsStore = create(
  persist<SettingsState>(
    (set, get) => ({
      enableDebug: false,
      exportFileTypes: ['png'],
      exportScaleFactors: [4],
      forceMagicCheck: true,
      handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
      hideDates: false,
      importDeleted: true,
      importLastSeen: true,
      importPad: false,
      pageSize: 30,
      preferredLocale: getDefaultLocale(),
      printerParams: '',
      printerUrl: '',
      savFrameTypes: 'int',
      enableImageGroups: false,
      sortPalettes: PaletteSortMode.DEFAULT_DESC,

      setEnableDebug: (enableDebug: boolean) => set({ enableDebug }),
      setForceMagicCheck: (forceMagicCheck: boolean) => set({ forceMagicCheck }),
      setHandleExportFrame: (handleExportFrame: ExportFrameMode) => set({ handleExportFrame }),
      setHideDates: (hideDates: boolean) => set({ hideDates }),
      setImportDeleted: (importDeleted: boolean) => set({ importDeleted }),
      setImportLastSeen: (importLastSeen: boolean) => set({ importLastSeen }),
      setImportPad: (importPad: boolean) => set({ importPad }),
      setPageSize: (pageSize: number) => set({ pageSize }),
      setPrinterParams: (printerParams: string) => set({ printerParams }),
      setPrinterUrl: (printerUrl: string) => set({ printerUrl: cleanUrl(printerUrl, 'http') }),
      setSavFrameTypes: (savFrameTypes: string) => set({ savFrameTypes }),
      setEnableImageGroups: (enableImageGroups: boolean) => set({ enableImageGroups }),
      setSortPalettes: (sortPalettes: PaletteSortMode) => set({ sortPalettes }),

      setExportScaleFactors: (updateFactor: number, checked: boolean) => {
        const { exportScaleFactors } = get();

        set({
          exportScaleFactors: checked ?
            [...exportScaleFactors, updateFactor] :
            exportScaleFactors.filter((factor) => (factor !== updateFactor)),
        });
      },

      setExportFileTypes: (updateFileType: string, checked: boolean) => {
        const { exportFileTypes } = get();

        set({
          exportFileTypes: checked ?
            [...exportFileTypes, updateFileType] :
            exportFileTypes.filter((fileType) => (fileType !== updateFileType)),
        });
      },

      setPreferredLocale: (preferredLocale: string) => {
        // Try if provided locale can be used without throwing an error
        try {
          dateFormatLocale(dayjs(), preferredLocale);
          set({ preferredLocale });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: `${PROJECT_PREFIX}-settings`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
