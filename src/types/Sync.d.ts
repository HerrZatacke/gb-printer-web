import type { files as Files } from 'dropbox/types/dropbox_types';

export type DBFolderAll = Files.FileMetadataReference | Files.FolderMetadataReference | Files.DeletedMetadataReference;
export type DBFolderFile = Files.FileMetadataReference;

export interface UploadDeleteResult {
  uploaded: Files.FileMetadata[],
  deleted: DBFolderFile[],
}

export interface GitUploadResult {
  uploaded?: string[],
  deleted?: string[],
  repo?: string,
}

export interface UploadFile {
  destination: string,
  blob: Blob,
}

export interface KeepFile {
  destination: string,
}

export interface DownloadInfo {
  folder?: 'images' | 'frames',
  filename: string,
  blob: Blob,
  title: string,
}

export interface RemoteFiles {
  toUpload: UploadFile[],
  toKeep: KeepFile[],
}

export type ExportStats = Record<string, number>;

export type AddToQueueFn<T> = (what: string, throttle: number, fn: () => Promise<T>, isSilent?: boolean) => Promise<T>

export interface GetSettingsOptions {
  lastUpdateUTC?: number,
  selectedFrameGroup?: string,
}

export interface RecentImport {
  hash: string,
  timestamp: number,
}

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

export interface GapiSettings {
  use?: boolean,
  sheetId?: string,
  token?: string,
  tokenExpiry?: number,
}

export interface SyncLastUpdate {
  dropbox: number,
  local: number,
}
