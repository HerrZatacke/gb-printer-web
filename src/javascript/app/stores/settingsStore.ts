import { create } from 'zustand';
import { ExportFrameMode } from 'gb-image-decoder';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PROJECT_PREFIX } from './constants';

interface Values {
  pageSize: number,
  exportScaleFactors: number[],
  exportFileTypes: string[],
  handleExportFrame: ExportFrameMode,
  savFrameTypes: string,
}

interface Actions {
  setPageSize: (pageSize: number) => void
  setExportScaleFactors: (factor: number, checked: boolean) => void
  setExportFileTypes: (updateFileType: string, checked: boolean) => void,
  setHandleExportFrame: (handleExportFrame: ExportFrameMode) => void,
  setSavFrameTypes: (savFrameTypes: string) => void,
}

export type SettingsState = Values & Actions;

const useSettingsStore = create(
  persist<SettingsState>(
    (set, get) => ({
      pageSize: 30,
      exportScaleFactors: [4],
      exportFileTypes: ['png'],
      handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
      savFrameTypes: 'int',

      setPageSize: (pageSize: number) => set({ pageSize }),

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
      setHandleExportFrame: (handleExportFrame: ExportFrameMode) => set({ handleExportFrame }),
      setSavFrameTypes: (savFrameTypes: string) => set({ savFrameTypes }),
    }),
    {
      name: `${PROJECT_PREFIX}-settings`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
