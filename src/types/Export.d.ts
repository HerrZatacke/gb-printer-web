import type { MonochromeImage, RGBNImage } from './Image';
import type { Frame } from './Frame';
import type { DownloadInfo, UploadFile } from './Sync';
import type { JSONExportState } from '../javascript/app/store/State';


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

export interface SyncFile extends Partial<MonochromeImage & RGBNImage & Frame> {
  hash: string,
  files: DownloadInfo[],
  inRepo: RepoFile[],
}

export interface RepoTasks {
  upload: UploadFile[],
  del: RepoFile[],
}
