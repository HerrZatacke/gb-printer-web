import { Frame } from './Frame';
import { Image, MonochromeImage, RGBNImage } from './Image';
import { JSONExportState } from '../javascript/app/store/middlewares/settings';

export interface RepoContents {
  images: Image[],
  frames: Frame[],
  settings: JSONExportState
}

interface RepoFile {
  contentHash: string,
  hash: string,
  name: string,
  path: string,
  getFileContent: () => Promise<string>,
}

export interface UploadFile {
  destination: string,
  blob: Blob,
}

export interface KeepFile {
  destination: string,
}

export interface WhateverFile {
  blob: Blob,
  folder: string,
}

export interface SyncFile extends Partial<MonochromeImage & RGBNImage & Frame> {
  hash: string,
  files: WhateverFile[],
  inRepo: RepoFile[]
}

export interface RemoteFiles {
  toUpload: UploadFile[],
  toKeep: KeepFile[],
}

export type ExportStats = Record<string, number>;

export type AddToQueueFn<T> = (what: string, throttle: number, fn: () => Promise<T>, isSilent?: boolean) => Promise<T>
