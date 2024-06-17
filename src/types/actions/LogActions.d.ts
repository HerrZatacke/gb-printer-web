import type { Actions } from '../../javascript/app/store/actions';
import type { GitUploadResult, UploadDeleteResult } from '../Sync';

export interface LogItem {
  timestamp: number,
  message: string,
}

export interface ProgressLog {
  git: LogItem[],
  dropbox: LogItem[],
}

export interface LogGitStorageAction {
  type: Actions.GITSTORAGE_LOG_ACTION,
  payload: LogItem,
}

export interface LogDropboxAction {
  type: Actions.DROPBOX_LOG_ACTION,
  payload: LogItem,
}

export interface LogStorageSyncDoneAction {
  type: Actions.STORAGE_SYNC_DONE,
  payload: {
    storageType: keyof ProgressLog,
    syncResult?: GitUploadResult | UploadDeleteResult | string[],
  }
}

export interface LogStorageDiffDoneAction {
  type: Actions.STORAGE_DIFF_DONE,
}

export interface LogClearAction {
  type: Actions.LOG_CLEAR,
}

export interface StorageSyncSelectAction {
  type: Actions.STORAGE_SYNC_SELECT,
}

export interface StorageSyncStartAction {
  type: Actions.STORAGE_SYNC_START,
  payload: {
    storageType: string,
    direction: string,
  }
}

export interface StorageSyncCancelAction {
  type: Actions.STORAGE_SYNC_CANCEL,
}
