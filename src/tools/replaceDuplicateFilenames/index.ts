import type { DownloadArrayBuffer } from '@/types/download';

const replaceDuplicateFilenames = (files: DownloadArrayBuffer[]): DownloadArrayBuffer[] => {

  const filenames: string[] = [];

  return files.map((file): DownloadArrayBuffer => {
    const { filename } = file;
    const fnParts = filename.split('.');
    const ext = fnParts.pop();

    if (!ext) {
      throw new Error('unknown file type');
    }

    const baseName = fnParts.join('.');
    let uFilename = filename;
    let tries = 0;

    while (filenames.includes(uFilename)) {
      tries += 1;
      uFilename = `${baseName}_(${tries}).${ext}`;
    }

    if (!filenames.includes(uFilename)) {
      filenames.push(uFilename);
    }

    return {
      ...file,
      filename: uFilename,
    };
  });
};

export default replaceDuplicateFilenames;
