import Queue from 'promise-queue';
import applyFrame from '../applyFrame';
import mapCartFrameToHash from './mapCartFrameToHash';
import getFileMeta from './getFileMeta';
import sortBy from '../sortby';
import transformImage from './transformImage';
import { compressAndHash } from '../storage';
import { compressAndHashFrame } from '../applyFrame/frameData';
import { Actions } from '../../app/store/actions';
import type { FileMetaData, ImportSavFn, ImportSavParams, WithTiles } from './types';
import type { ImportQueueAddMultiAction } from '../../../types/actions/QueueActions';
import type { ImportItem } from '../../../types/ImportItem';
import { reduceItems } from '../reduceArray';
import { randomId } from '../randomId';

const sortByAlbumIndex = sortBy<(FileMetaData & WithTiles)>('albumIndex');

const getImportSav = ({
  importLastSeen,
  data,
  lastModified,
  frames,
  fileName,
  importDeleted,
  dispatch,
  forceMagicCheck,
}: ImportSavParams): ImportSavFn | null => {
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
    const adresses = (new Array(30)).fill(null)
      .map((_, index) => (
        (index + 2) * 0x1000
      ))
      .filter((address) => address < data.length);

    if (importLastSeen) {
      adresses.unshift(0);
    }

    const images: ((FileMetaData & WithTiles) | null)[] = await Promise.all(
      adresses.map(async (address): Promise<(FileMetaData & WithTiles) | null> => {
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

    const sortedImages = sortByAlbumIndex(images.filter(Boolean) as (FileMetaData & WithTiles)[]);

    const queue = new Queue(1, Infinity);

    let displayIndex = 0;

    const imageData = await Promise.all(sortedImages.map(async ({ albumIndex, tiles, meta }) => (
      queue.add(async (): Promise<ImportItem | undefined> => {
        let indexText;
        switch (albumIndex) {
          case 64:
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
        const { dataHash: frameHash } = await compressAndHashFrame(tiles, 2);

        const fName = typeof fileName === 'function' ?
          fileName({ indexText, albumIndex, displayIndex }) :
          `${fileName} ${indexText}`;

        return {
          fileName: fName,
          imageHash,
          frameHash,
          tiles,
          lastModified,
          meta,
          tempId: randomId(),
        };
      })
    )));

    dispatch<ImportQueueAddMultiAction>({
      type: Actions.IMPORTQUEUE_ADD_MULTI,
      payload: imageData.reduce(reduceItems<ImportItem>, []),
    });

    return true;
  };
};

export default getImportSav;
