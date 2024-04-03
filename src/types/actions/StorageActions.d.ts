import { Actions } from '../../javascript/app/store/actions';

export interface DropBoxSettings {
  use?: boolean,
  refreshToken?: string,
  accessToken?: string,
  expiresAt?: number,
  path?: string,
  autoDropboxSync?: boolean,
}

export interface SyncLastUpdate {
  dropbox: number,
  local: number,
}

export interface DropboxStorageAction {
  type: Actions.DROPBOX_LOGOUT | Actions.SET_DROPBOX_STORAGE,
  payload: DropBoxSettings
}

export interface DropboxSettingsImportAction {
  type: Actions.DROPBOX_SETTINGS_IMPORT,
  payload: {
    state: {
      lastUpdateUTC: number,
    }
  }
}

export interface DropboxLastUpdateAction {
  type: Actions.LAST_UPDATE_DROPBOX_REMOTE,
  payload: number,
}
