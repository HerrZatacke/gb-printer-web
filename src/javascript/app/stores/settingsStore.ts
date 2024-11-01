import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PROJECT_PREFIX } from './constants';

interface Values {
  pageSize: number,
}

interface Actions {
  setPageSize: (pageSize: number) => void
}

export type SettingsState = Values & Actions;

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      pageSize: 30,

      setPageSize: (pageSize: number) => set({ pageSize }),
    }),
    {
      name: `${PROJECT_PREFIX}-settings`,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
