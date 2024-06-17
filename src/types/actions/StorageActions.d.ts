import { Actions } from '../../javascript/app/store/actions';
import { ExportTypes } from '../../javascript/consts/exportTypes';
import { RepoContents } from '../Export';
import { DropBoxSettings, GitStorageSettings } from '../Sync';
import { JSONExportState } from '../../javascript/app/store/State';

export interface DropboxLogoutAction {
  type: Actions.DROPBOX_LOGOUT,
}

export interface DropboxSetStorageAction {
  type: Actions.SET_DROPBOX_STORAGE,
  payload?: DropBoxSettings
}

export interface DropboxSettingsImportAction {
  type: Actions.DROPBOX_SETTINGS_IMPORT,
  payload: JSONExportState
}

export interface DropboxLastUpdateAction {
  type: Actions.LAST_UPDATE_DROPBOX_REMOTE,
  payload: number,
}

export interface DropboxStartAuthAction {
  type: Actions.DROPBOX_START_AUTH,
}

export interface GitStorageAction {
  type: Actions.SET_GIT_STORAGE,
  payload?: GitStorageSettings
}

export interface GitSettingsImportAction {
  type: Actions.GIT_SETTINGS_IMPORT,
  payload: RepoContents,
}

export interface ImportJSONAction {
  type: Actions.JSON_IMPORT,
  payload: Partial<JSONExportState>,
}

export interface ExportJSONAction {
  type: Actions.JSON_EXPORT,
  payload: ExportTypes,
  selectedFrameGroup?: string,
}

export interface ExportFileTypesAction {
  type: Actions.UPDATE_EXPORT_FILE_TYPES,
  payload: {
    checked: boolean,
    fileType: string,
  }
}

export interface ExportScaleFactorsAction {
  type: Actions.UPDATE_EXPORT_SCALE_FACTORS,
  payload: {
    checked: boolean,
    factor: number,
  }
}

export interface ForceMagicCheckAction {
  type: Actions.SET_FORCE_MAGIC_CHECK,
  payload: boolean,
}
