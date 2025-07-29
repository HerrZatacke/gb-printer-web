import Queue from 'promise-queue';
import { SavImportOrder } from '@/consts/SavImportOrder';
import useImportsStore from '@/stores/importsStore';
import applyFrame from '@/tools/applyFrame';
import { randomId } from '@/tools/randomId';
import { reduceItems } from '@/tools/reduceArray';
import sortBy from '@/tools/sortby';
import { compressAndHash } from '@/tools/storage';
import type { ImportItem } from '@/types/ImportItem';
import type { FileMetaData, ImportSavFn, ImportSavParams, WithTiles } from '@/types/transformSav';
import getFileMeta from './getFileMeta';
import mapCartFrameToHash from './mapCartFrameToHash';
import transformImage from './transformImage';

const sortByAlbumIndex = sortBy<(FileMetaData & WithTiles)>('albumIndex');

const getImportSav = ({
  importLastSeen,
  savImportOrder,
  data,
  lastModified,
  frames,
  fileName,
  importDeleted,
  forceMagicCheck,
}: ImportSavParams): ImportSavFn | null => {
  const { importQueueAdd } = useImportsStore.getState();

  if (forceMagicCheck) {
    const magicPlaces = [
      0x10D2,
      0x11AB,
      0x11D0,
      0x11F5,
    ];

    const notMagic = magicPlaces.some((index) => (
      [...data.subarray(index, index + 5)]
        .map((ch) => (
          String.fromCharCode(ch)
        )).join('') !== 'Magic'
    ));

    if (notMagic) {
      return null;
    }
  }

  return async (selectedFrameset, cartIsJP) => {
    const imageSlots = Math.ceil(data.byteLength / 0x1000);

    let addresses = Array.from({ length: imageSlots }, (_, i) => i * 0x1000);

    if (data.byteLength === 0x100000) {
      const romNameBytes = data.subarray(0x134, 0x134 + 0x10);
      const textDecoder = new TextDecoder();
      const romName = textDecoder.decode(romNameBytes.filter((byte) => (byte !== 0 && byte !== 128))).trim();

      // If it's an actual PHOTO!-ROM, not a 8-bank save file
      if (romName === 'PHOTO') {
        // Remove first 32 (non-)images
        addresses = addresses.slice(32);
      }
    }

    // remove "gameFace"
    addresses = addresses.filter((address) => ((address - 0x1000) % 0x20000) !== 0);

    if (!importLastSeen) {
      addresses = addresses.filter((address) => (address % 0x20000) !== 0);
    }

    const images: ((FileMetaData & WithTiles) | null)[] = await Promise.all(
      addresses.map(async (address): Promise<(FileMetaData & WithTiles) | null> => {
        const meta = getFileMeta(data, address, cartIsJP);
        const { frameNumber } = meta;

        const transformedData = transformImage(data, address);

        if (transformedData) {
          const tiles = await applyFrame(transformedData, mapCartFrameToHash(frameNumber, selectedFrameset, frames));
          return {
            tiles,
            ...meta,
          };
        }

        return null;
      }),
    );

    const ramOrderImages = images.filter(Boolean) as (FileMetaData & WithTiles)[];

    const sortedImages = savImportOrder === SavImportOrder.RAM_INDEX ? ramOrderImages : sortByAlbumIndex(ramOrderImages);

    const queue = new Queue(1, Infinity);

    let displayIndex = 0;

    const imageData = await Promise.all(sortedImages.map(async ({ albumIndex, tiles, meta }) => (
      queue.add(async (): Promise<ImportItem | undefined> => {
        let indexText;
        switch (albumIndex) {
          case -1:
            indexText = '[last seen]';
            break;
          case 255:
            if (!importDeleted) {
              return undefined;
            }

            indexText = '[deleted]';
            break;
          default:
            displayIndex += 1;
            indexText = displayIndex.toString(10).padStart(2, '0');
            break;
        }

        const { dataHash: imageHash } = await compressAndHash(tiles);

        const fName = typeof fileName === 'function' ?
          fileName({ indexText, albumIndex, displayIndex }) :
          `${fileName} ${indexText}`;

        return {
          fileName: fName,
          imageHash,
          tiles,
          lastModified,
          meta,
          tempId: randomId(),
        };
      })
    )));

    importQueueAdd(imageData.reduce(reduceItems<ImportItem>, []));

    return true;
  };
};

export default getImportSav;
