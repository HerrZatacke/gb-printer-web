import chunk from 'chunk';
import readFileAs from '../readFileAs';
import getImportSav from '../transformSav/importSav';

const pad2 = (number) => (
  number.toString(10).padStart(2, '0')
);

const getTransformRom = ({ getState, dispatch }) => async (file) => {
  const { default: objectHash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const data = await readFileAs(file, 'uint8array');

  const { importLastSeen, importDeleted, forceMagicCheck } = getState();

  let banks = chunk(data, 0x20000)
    .map((bankData, bankIndex) => ({
      bankData,
      bankIndex,
      hash: objectHash(bankData),
    }));

  banks = banks.filter((bank, index) => (
    banks.findIndex(({ hash }) => (hash === bank.hash)) === index
  ));

  const result = await Promise.all(banks.map(async ({
    bankData,
    bankIndex,
  }) => {
    if (bankIndex === 0) {
      return false;
    }

    const fileName = ({ albumIndex }) => {
      if (albumIndex === 64) {
        return `${file.name} - bank ${pad2(bankIndex)} [last seen]`;
      }

      if (albumIndex === 255) {
        return `${file.name} - bank ${pad2(bankIndex)} [deleted]`;
      }

      return `${file.name} - bank ${pad2(bankIndex)} - image ${pad2(albumIndex + 1)}`;
    };

    const importSav = getImportSav({
      importLastSeen,
      data: bankData,
      lastModified: file.lastModified,
      frames: [],
      fileName,
      importDeleted,
      dispatch,
      forceMagicCheck,
    });

    if (!importSav) {
      return false;
    }

    return importSav('', false);
  }));

  if (!result.filter(Boolean).length) {
    throw new Error('File does not contain any recognizable images');
  }

  return result;
};

export default getTransformRom;
