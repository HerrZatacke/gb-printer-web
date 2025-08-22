import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import type { DropBoxSettings, GitStorageSettings, SyncLastUpdate } from '@/types/Sync';
import { PROJECT_PREFIX } from './constants';

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

const dropboxDefaults: DropBoxSettings = {
  use: false,
  refreshToken: '',
  accessToken: '',
  expiresAt: 0,
  path: '',
  autoDropboxSync: false,
};

const gitDefaults: GitStorageSettings = {
  branch: '',
  owner: '',
  repo: '',
  throttle: 10,
  token: '',
  use: false,
};

const useStoragesStore = create(
  subscribeWithSelector(
    persist<StoragesState>(
      (set) => ({
        dropboxStorage: {},
        gitStorage: {},
        syncLastUpdate: { dropbox: 0, local: 0 },

        dropboxLogout: () => set(({ dropboxStorage }) => ({ dropboxStorage: {
          ...dropboxDefaults,
            use: dropboxStorage.use,
            path: dropboxStorage.path,
        } })),
        setDropboxStorage: (newSettings: DropBoxSettings) => set(({ dropboxStorage }) => (
          { dropboxStorage: { ...dropboxDefaults, ...dropboxStorage, ...newSettings } }
        )),
        setGitStorage: (newSettings: GitStorageSettings) => set(({ gitStorage }) => (
          { gitStorage: { ...gitDefaults, ...gitStorage, ...newSettings } }
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
