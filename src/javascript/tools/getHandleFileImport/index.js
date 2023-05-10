import getTransformBin from '../transformBin';
import getTransformSav from '../transformSav';
import getTransformRom from '../transformRom';
import getTransformReduced from '../transformReduced';
import getTransformBitmaps from '../transformBitmaps';
import getTransformPlainText from '../transformPlainText';
import getImportJSON from '../importJSON';
import prepareFile from './prepareFile';

const getHandleFileImport = (store) => {
  const transformSav = getTransformSav(store);
  const transformRom = getTransformRom(store);
  const transformBin = getTransformBin(store);
  const transformBitmaps = getTransformBitmaps(store);
  const transformPlainText = getTransformPlainText(store);
  const transformReduced = getTransformReduced(store);
  const importJSON = getImportJSON(store);

  return async (files, { fromPrinter } = { fromPrinter: false }) => {

    await Promise.all(files.map((fileData) => {
      const { file, contentType } = prepareFile(fileData);

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
        return transformSav(file);
      }

      // .extracting 7 banks of a photo rom
      if ((
        file.name?.toLowerCase().endsWith('.gb') ||
        file.name?.toLowerCase().endsWith('.gbc')
      ) && (
        file.size === 0x100000
      )) {
        return transformRom(file);
      }

      if (contentType === 'application/pico-printer-binary-log') {
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
