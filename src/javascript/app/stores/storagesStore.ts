import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { PROJECT_PREFIX } from './constants';
import type { DropBoxSettings, GitStorageSettings } from '../../../types/Sync';

interface Values {
  dropboxStorage: DropBoxSettings,
  gitStorage: GitStorageSettings,
}

interface Actions {
  dropboxLogout: () => void,
  setDropboxStorage: (dropboxStorage: DropBoxSettings) => void,
  setGitStorage: (gitStorage: GitStorageSettings) => void,
}

export type StoragesState = Values & Actions;

const useStoragesStore = create(
  subscribeWithSelector(
    persist<StoragesState>(
      (set) => ({
        dropboxStorage: {},
        gitStorage: {},

        dropboxLogout: () => set(({ dropboxStorage }) => ({ dropboxStorage: { use: dropboxStorage.use } })),
        setDropboxStorage: (newSettings: DropBoxSettings) => set(({ dropboxStorage }) => (
          { dropboxStorage: { ...dropboxStorage, ...newSettings } }
        )),
        setGitStorage: (newSettings: GitStorageSettings) => set(({ gitStorage }) => (
          { gitStorage: { ...gitStorage, ...newSettings } }
        )),
      }),
      {
        name: `${PROJECT_PREFIX}-storages`,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export default useStoragesStore;
