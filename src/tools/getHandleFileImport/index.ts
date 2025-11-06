import type { ImportFn } from '@/hooks/useImportExportSettings';
import { getImportJSON } from '@/tools/importExportSettings/getImportJSON';
import { transformBin } from '@/tools/transformBin';
import { transformBitmaps } from '@/tools/transformBitmaps';
import { transformPlainText } from '@/tools/transformPlainText';
import { transformReduced } from '@/tools/transformReduced';
import { transformSav } from '@/tools/transformSav';
import { ImportResult } from '@/types/ImportItem';
import type { PreparedFile } from './prepareFile';
import prepareFile from './prepareFile';

export interface HandeFileImportOptions {
  fromPrinter: boolean
  savFrameSet?: string,
}

export type HandeFileImportFn = (files: File[], options?: HandeFileImportOptions) => Promise<ImportResult[]>;

const getHandleFileImport = (importFn: ImportFn): HandeFileImportFn => {
  const importJSON = getImportJSON(importFn);

  return async (files, { fromPrinter, savFrameSet } = { fromPrinter: false }): Promise<ImportResult[]> => {

    const fileResults = await Promise.all(files.map((fileData): Promise<ImportResult> => {
      const { file, contentType }: PreparedFile = prepareFile(fileData);

      if (contentType && contentType.startsWith('image/')) {
        return transformBitmaps(file, fromPrinter);
      }

      // roughly larger than 256MB is too much....
      if (file.size > 0xfffffff) {
        throw new Error('File too large');
      }

      if (contentType === 'text/plain') {
        return transformPlainText(file);
      }

      if (contentType === 'application/json') {
        return importJSON(file);
      }

      // .sav files are always exactly 128kB, but we allow any multiple of 4kB
      if (
        (
          file.name?.toLowerCase().endsWith('.gb') ||
          file.name?.toLowerCase().endsWith('.gbc') ||
          file.name?.toLowerCase().endsWith('.sav')
        ) && (
          file.size % 0x1000 === 0 ||
          file.size === 3584 // Special case: PicNRec .sav
        )
      ) {
        return transformSav(file, {
          skipDialogs: file.size !== 0x20000, // Skip dialogs for all non-standard save files
          frameSet: savFrameSet,
        });
      }

      // can use src/assets/dumps/pico.bin for testing
      if (contentType === 'application/pico-printer-binary-log' /*  || file.name.endsWith('pico.bin') */) {
        return transformReduced(file);
      }

      if (contentType.startsWith('application/')) {
        return transformBin(file);
      }

      throw new Error('Not a dump');
    }));

    return fileResults;
  };
};

export default getHandleFileImport;
