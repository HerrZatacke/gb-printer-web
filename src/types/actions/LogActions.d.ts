import { Actions } from '../../javascript/app/store/actions';


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
  }
}

export interface LogStorageDiffDoneAction {
  type: Actions.STORAGE_DIFF_DONE,
}

export interface LogClearAction {
  type: Actions.LOG_CLEAR,
}
