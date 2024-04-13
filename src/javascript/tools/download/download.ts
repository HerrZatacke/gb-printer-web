import { saveAs } from 'file-saver';
import blobToArrayBuffer from '../blobToArrayBuffer';
import replaceDuplicateFilenames from '../replaceDuplicateFilenames';
import { DownloadArrayBuffer, DownloadBlob, UniqueFilenameDownloadArrayBuffer } from './types';

const download = (zipFileName: string | null) => async (files: DownloadBlob[]): Promise<void> => {

  // if only one file,
  if (files.length === 1) {
    const image = files[0];
    return saveAs(image.blob, image.filename);
  }

  const { default: JSZip } = await import(/* webpackChunkName: "jsz" */ 'jszip');

  const zip = new JSZip();

  const buffers: DownloadArrayBuffer[] = await Promise.all(files.map(({ filename, blob }) => (
    blobToArrayBuffer(blob)
      .then((arrayBuffer) => ({
        filename,
        arrayBuffer,
      }))
  )));

  const uniqueBufferFiles: UniqueFilenameDownloadArrayBuffer[] = replaceDuplicateFilenames(buffers);

  uniqueBufferFiles.forEach(({ uFilename, arrayBuffer }: UniqueFilenameDownloadArrayBuffer) => {
    zip.file(uFilename, arrayBuffer);
  });


  const content: Blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
  });

  if (!zipFileName) {
    throw new Error('missing filename');
  }

  return saveAs(content, `${zipFileName}.zip`);
};

export default download;
