import chunk from 'chunk';
import readFileAs from '../readFileAs';
import getImportSav from '../transformSav/importSav';

const getTransformRom = ({ getState, dispatch }) => async (file) => {
  const { default: objectHash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const data = await readFileAs(file, 'arrayBuffer');

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

  let displayIndex = 0;
  const result = await Promise.all(banks.map(async ({
    bankData,
    bankIndex,
  }) => {
    if (bankIndex === 0) {
      return false;
    }

    const fileName = ({ albumIndex }) => {
      if (albumIndex === 64) {
        return `${file.name} [last seen in bank ${bankIndex}]`;
      }

      if (albumIndex === 255) {
        return `${file.name} [deleted in bank ${bankIndex}]`;
      }

      displayIndex += 1;
      return `${file.name} ${displayIndex.toString(10).padStart(3, '0')} in bank ${bankIndex}`;
    };

    const importSav = getImportSav({
      importLastSeen,
      data: bankData,
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
