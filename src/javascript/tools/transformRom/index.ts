import chunk from 'chunk';
import readFileAs, { ReadAs } from '../readFileAs';
import getImportSav from '../transformSav/importSav';
import type { TypedStore } from '../../app/store/State';
import type { GenerateFilenameFn } from '../transformSav/types';

export interface RomBank {
  bankData: Uint8Array,
  bankIndex: number,
  hash: string,
}

const pad2 = (number: number) => (
  number.toString(10).padStart(2, '0')
);

const getTransformRom = ({ getState, dispatch }: TypedStore) => async (file: File): Promise<boolean[]> => {
  const { default: objectHash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const { importLastSeen, importDeleted, forceMagicCheck } = getState();

  const banks = (chunk(data, 0x20000) as unknown as Uint8Array[])
    .reduce((acc: RomBank[], bankData, bankIndex: number): RomBank[] => {
      const bankHash = objectHash(bankData);

      if (acc.findIndex(({ hash }) => (hash === bankHash)) !== -1) {
        return acc;
      }

      return [
        ...acc,
        {
          bankData,
          bankIndex,
          hash: bankHash,
        },
      ];
    }, []);

  const result: boolean[] = await banks.reduce(async (
    acc: Promise<boolean[]>,
    {
      bankData,
      bankIndex,
    }: RomBank,
  ): Promise<boolean[]> => {
    const nAcc = await acc;

    if (bankIndex === 0) {
      return [...nAcc, false];
    }

    const fileName: GenerateFilenameFn = ({ albumIndex }) => {
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
      return [...nAcc, false];
    }

    return [
      ...nAcc,
      await importSav('', false),
    ];

  }, Promise.resolve([]));

  if (!result.filter(Boolean).length) {
    throw new Error('File does not contain any recognizable images');
  }

  return result;
};

export default getTransformRom;
