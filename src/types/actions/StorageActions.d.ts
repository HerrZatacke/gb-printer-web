import { Actions } from '../../javascript/app/store/actions';

export interface DropBoxSettings {
  use?: boolean,
  refreshToken?: string,
  accessToken?: string,
  expiresAt?: number,
  path?: string,
  autoDropboxSync?: boolean,
}

export interface GitStorageSettings {
  use?: boolean,
  owner?: string,
  repo?: string,
  branch?: string,
  token?: string,
  throttle?: number,
}

export interface SyncLastUpdate {
  dropbox: number,
  local: number,
}

export interface DropboxLogoutAction {
  type: Actions.DROPBOX_LOGOUT,
}

export interface DropboxSetStorageAction {
  type: Actions.SET_DROPBOX_STORAGE,
  payload?: DropBoxSettings
}

export interface DropboxSettingsImportAction {
  type: Actions.DROPBOX_SETTINGS_IMPORT,
  payload?: {
    state: {
      lastUpdateUTC: number,
    }
  }
}

export interface DropboxLastUpdateAction {
  type: Actions.LAST_UPDATE_DROPBOX_REMOTE,
  payload: number,
}

export interface GitStorageAction {
  type: Actions.SET_GIT_STORAGE,
  payload?: GitStorageSettings
}
