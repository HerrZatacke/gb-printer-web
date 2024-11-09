import getTransformSav from '../transformSav';
import { getImportJSON } from '../importExportSettings/getImportJSON';
import { transformBin } from '../transformBin';
import { transformRom } from '../transformRom';
import { transformReduced } from '../transformReduced';
import { transformBitmaps } from '../transformBitmaps';
import { transformPlainText } from '../transformPlainText';
import prepareFile from './prepareFile';
import type { PreparedFile } from './prepareFile';
import type { TypedStore } from '../../app/store/State';

export interface HandeFileImportOptions {
  fromPrinter: boolean
}

export type HandeFileImportFn = (files: File[], options?: HandeFileImportOptions) => Promise<void>;

const getHandleFileImport = (store: TypedStore): HandeFileImportFn => {
  const transformSav = getTransformSav(store);
  const importJSON = getImportJSON(store);

  return async (files, { fromPrinter } = { fromPrinter: false }): Promise<void> => {

    await Promise.all(files.map((fileData) => {
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
        file.name?.toLowerCase().endsWith('.sav') && (
          file.size % 0x1000 === 0 ||
          file.size === 3584 // Special case: PicNRec .sav
        )
      ) {
        return transformSav(file, file.size === 3584);
      }

      // .extracting 7 banks of a photo rom
      if ((
        file.name?.toLowerCase().endsWith('.gb') ||
        file.name?.toLowerCase().endsWith('.gbc')
      ) && (
        file.size % 0x100000 === 0
      )) {
        return transformRom(file);
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

    // ToDo: display some import counter?
  };
};

export default getHandleFileImport;
