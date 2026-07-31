import { type JSONExport } from './ExportState';
import { type DownloadInfo, type UploadFile } from './Sync';

export interface RepoFile {
  hash: string;
  name: string;
  path: string;
  getFileContent: () => Promise<string>;
}

export interface DropBoxRepoFile extends RepoFile {
  contentHash: string;
}

export interface RepoContents {
  images: RepoFile[];
  frames: RepoFile[];
  settings: JSONExport;
}

export interface SyncFile {
  hash: string;
  files: DownloadInfo[];
  inRepo: RepoFile[];
}

export interface RepoTasks {
  upload: UploadFile[];
  del: RepoFile[];
}
