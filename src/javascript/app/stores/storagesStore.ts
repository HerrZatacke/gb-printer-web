import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { PROJECT_PREFIX } from './constants';
import type { DropBoxSettings, GitStorageSettings, SyncLastUpdate } from '../../../types/Sync';

interface Values {
  dropboxStorage: DropBoxSettings,
  gitStorage: GitStorageSettings,
  syncLastUpdate: SyncLastUpdate,
}

interface Actions {
  dropboxLogout: () => void,
  setDropboxStorage: (dropboxStorage: DropBoxSettings) => void,
  setGitStorage: (gitStorage: GitStorageSettings) => void,
  setSyncLastUpdate: (what: keyof SyncLastUpdate, value: number) => void,
}

export type StoragesState = Values & Actions;

const useStoragesStore = create(
  subscribeWithSelector(
    persist<StoragesState>(
      (set) => ({
        dropboxStorage: {},
        gitStorage: {},
        syncLastUpdate: { dropbox: 0, local: 0 },

        dropboxLogout: () => set(({ dropboxStorage }) => ({ dropboxStorage: { use: dropboxStorage.use } })),
        setDropboxStorage: (newSettings: DropBoxSettings) => set(({ dropboxStorage }) => (
          { dropboxStorage: { ...dropboxStorage, ...newSettings } }
        )),
        setGitStorage: (newSettings: GitStorageSettings) => set(({ gitStorage }) => (
          { gitStorage: { ...gitStorage, ...newSettings } }
        )),
        setSyncLastUpdate: (what: keyof SyncLastUpdate, value: number) => (set(({ syncLastUpdate }) => (
          { syncLastUpdate: { ...syncLastUpdate, [what]: value } }
        ))),
      }),
      {
        name: `${PROJECT_PREFIX}-storages`,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export default useStoragesStore;
