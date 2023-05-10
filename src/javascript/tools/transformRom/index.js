import chunk from 'chunk';
import readFileAs from '../readFileAs';
import getImportSav from '../transformSav/importSav';

const getTransformSav = ({ getState, dispatch }) => async (file) => {
  const data = await readFileAs(file, 'arrayBuffer');

  const { importLastSeen, importDeleted } = getState();

  const banks = chunk(data, 0x20000);

  let displayIndex = 0;
  return Promise.all(banks.map(async (bankData, bankIndex) => {
    if (bankIndex === 0) {
      return true;
    }

    const fileName = ({ albumIndex }) => {
      if (albumIndex === 64) {
        return `${file.name} [last seen bank ${bankIndex}]`;
      }

      if (albumIndex === 255) {
        return `${file.name} [deleted]`;
      }

      displayIndex += 1;
      return `${file.name} ${displayIndex.toString(10).padStart(3, '0')}`;
    };

    const importSav = getImportSav({
      importLastSeen,
      data: bankData,
      frames: [],
      fileName,
      importDeleted,
      dispatch,
    });

    return importSav('', false);
  }));
};

export default getTransformSav;
