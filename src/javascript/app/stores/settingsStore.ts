import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PROJECT_PREFIX } from './constants';

interface Values {
  pageSize: number,
  exportScaleFactors: number[],
}

interface Actions {
  setPageSize: (pageSize: number) => void
  setExportScaleFactors: (factor: number, checked: boolean) => void
}

export type SettingsState = Values & Actions;

const useSettingsStore = create(
  persist<SettingsState>(
    (set, get) => ({
      pageSize: 30,
      exportScaleFactors: [4],

      setPageSize: (pageSize: number) => set({ pageSize }),

      setExportScaleFactors: (updateFactor: number, checked: boolean) => {
        const { exportScaleFactors } = get();

        set({
          exportScaleFactors: checked ?
            [...exportScaleFactors, updateFactor] :
            exportScaleFactors.filter((factor) => (factor !== updateFactor)),
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
