import type { JSONExportState } from './ExportState';
import type { DownloadInfo, UploadFile } from './Sync';

export interface RepoFile {
  hash: string,
  name: string,
  path: string,
  getFileContent: () => Promise<string>,
}

export interface DropBoxRepoFile extends RepoFile {
  contentHash: string,
}

export interface RepoContents {
  images: RepoFile[],
  frames: RepoFile[],
  settings: JSONExportState
}

export interface SyncFile {
  hash: string,
  files: DownloadInfo[],
  inRepo: RepoFile[],
}

export interface RepoTasks {
  upload: UploadFile[],
  del: RepoFile[],
}
