import { create } from 'zustand';
import { ExportFrameMode } from 'gb-image-decoder';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PROJECT_PREFIX } from './constants';

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
  savFrameTypes: string,
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
  setSavFrameTypes: (savFrameTypes: string) => void,
}

export type SettingsState = Values & Actions;

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
      savFrameTypes: 'int',

      setEnableDebug: (enableDebug: boolean) => set({ enableDebug }),
      setForceMagicCheck: (forceMagicCheck: boolean) => set({ forceMagicCheck }),
      setHandleExportFrame: (handleExportFrame: ExportFrameMode) => set({ handleExportFrame }),
      setHideDates: (hideDates: boolean) => set({ hideDates }),
      setImportDeleted: (importDeleted: boolean) => set({ importDeleted }),
      setImportLastSeen: (importLastSeen: boolean) => set({ importLastSeen }),
      setImportPad: (importPad: boolean) => set({ importPad }),
      setPageSize: (pageSize: number) => set({ pageSize }),
      setSavFrameTypes: (savFrameTypes: string) => set({ savFrameTypes }),

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
    }),
    {
      name: `${PROJECT_PREFIX}-settings`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
