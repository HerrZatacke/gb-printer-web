import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import type { DropBoxSettings, GapiSettings, GitStorageSettings, SyncLastUpdate } from '@/types/Sync';
import { PROJECT_PREFIX } from './constants';

interface Values {
  dropboxStorage: DropBoxSettings,
  gitStorage: GitStorageSettings,
  gapiStorage: GapiSettings,
  syncLastUpdate: SyncLastUpdate,
}

interface Actions {
  dropboxLogout: () => void,
  setDropboxStorage: (dropboxStorage: DropBoxSettings) => void,
  setGitStorage: (gitStorage: GitStorageSettings) => void,
  setGapiSettings: (gapiStorage: GapiSettings) => void,
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

const gapiDefaults: GapiSettings = {
  use: false,
  sheetId: '',
  token: '',
  tokenExpiry: 0,
};

export const createStoragesStore = () => (
  create(
    subscribeWithSelector(
      persist<StoragesState>(
        (set) => ({
          dropboxStorage: {},
          gitStorage: {},
          gapiStorage: {},
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
          setGapiSettings: (newSettings: GapiSettings) => set(({ gapiStorage }) => (
            { gapiStorage: { ...gapiDefaults, ...gapiStorage, ...newSettings } }
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
  )
);
