import chunk from 'chunk';
import objectHash from 'object-hash';
import type { RomBank } from '../../tools/transformRom';

export const getBanksData = async (fileContent: Buffer) => (
  (chunk(fileContent, 0x20000) as unknown as Uint8Array[])
    .reduce((acc: RomBank[], bankData, bankIndex: number): RomBank[] => {
      if (bankIndex === 0 && fileContent.length > 0x20000) {
        return acc;
      }

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
    }, [])
);
