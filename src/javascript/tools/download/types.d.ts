export interface DownloadBlob {
  blob: Blob,
  filename: string,
}

export interface DownloadArrayBuffer {
  filename: string,
  arrayBuffer: ArrayBuffer,
}

export interface UniqueFilename {
  uFilename: string,
}

export type UniqueFilenameDownloadArrayBuffer = DownloadArrayBuffer & UniqueFilename;
