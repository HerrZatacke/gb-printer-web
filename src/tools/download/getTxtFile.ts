import { load } from '../storage';
import { finalLine, initLine, moreLine, terminatorLine } from '../../app/defaults';
import type { DownloadInfo } from '../../../types/Sync';

export const getTxtFile = async (hash: string, title: string, filename: string): Promise<DownloadInfo> => {
  const plainTiles = await load(hash);

  const transformedTiles = (plainTiles || [])
    // add spaces between every second char
    .map((line) => (
      line.match(/.{1,2}/g)
        ?.join(' ') || ''
    ))
    .reduce((acc: string[], line: string, index: number): string[] => {
      if (index % 40) {
        return [...acc, line];
      }

      return [...acc, moreLine, line];
    }, []);

  const textContent = [
    initLine,
    ...transformedTiles,
    finalLine,
    terminatorLine,
  ].join('\n');

  // toDownload
  return {
    folder: 'images', // used for Git-Sync
    filename: `${filename}.txt`,
    blob: new Blob(new Array(textContent), { type: 'text/plain' }),
    title,
  };
};
