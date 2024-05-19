import { Frame } from './Frame';
import { MonochromeImage, RGBNImage } from './Image';
import { ExportableState } from '../javascript/tools/getGetSettings/types';

export interface JSONExportState {
  state: ExportableState,
}

export interface JSONExportBinary {
  [k: string]: string,
}

export type JSONExport = JSONExportState & JSONExportBinary;

export interface RepoFile {
  contentHash: string,
  hash: string,
  name: string,
  path: string,
  getFileContent: () => Promise<string>,
}

export interface RepoContents {
  images: RepoFile[],
  frames: RepoFile[],
  settings: JSONExportState
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

export interface SyncFile extends Partial<MonochromeImage & RGBNImage & Frame> {
  hash: string,
  files: DownloadInfo[],
  inRepo: RepoFile[],
}

export interface RemoteFiles {
  toUpload: UploadFile[],
  toKeep: KeepFile[],
}

export type ExportStats = Record<string, number>;

export type AddToQueueFn<T> = (what: string, throttle: number, fn: () => Promise<T>, isSilent?: boolean) => Promise<T>

export interface RepoTasks {
  upload: UploadFile[],
  del: RepoFile[],
}
