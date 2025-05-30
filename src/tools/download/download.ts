import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import blobToArrayBuffer from '@/tools/blobToArrayBuffer';
import replaceDuplicateFilenames from '@/tools/replaceDuplicateFilenames';
import { DownloadArrayBuffer, DownloadBlob } from '@/types/download';

const download = (zipFileName: string | null) => async (files: DownloadBlob[]): Promise<void> => {

  // if only one file,
  if (files.length === 1) {
    const image = files[0];
    return saveAs(image.blob, image.filename);
  }

  const zip = new JSZip();

  const buffers: DownloadArrayBuffer[] = await Promise.all(files.map(({ filename, blob }) => (
    blobToArrayBuffer(blob)
      .then((arrayBuffer) => ({
        filename,
        arrayBuffer,
      }))
  )));

  const uniqueBufferFiles: DownloadArrayBuffer[] = replaceDuplicateFilenames(buffers);

  uniqueBufferFiles.forEach(({ filename, arrayBuffer }: DownloadArrayBuffer) => {
    zip.file(filename, arrayBuffer);
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
