import applyFrame from '../applyFrame';
import mapCartFrameToHash from './mapCartFrameToHash';
import getFileMeta from './getFileMeta';
import sortBy from '../sortby';
import transformImage from './transformImage';
import { compressAndHash } from '../storage';
import { compressAndHashFrame } from '../applyFrame/frameData';
import { IMPORTQUEUE_ADD } from '../../app/store/actions';

const sortByAlbumIndex = sortBy('albumIndex');

const getImportSav = ({
  importLastSeen,
  data,
  lastModified,
  frames,
  fileName,
  importDeleted,
  dispatch,
  forceMagicCheck,
}) => {
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

    const images = await Promise.all(adresses.map(async (address) => {
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
    }));

    const sortedImages = sortByAlbumIndex(images.filter(Boolean));

    let displayIndex = 0;
    await Promise.all(sortedImages.map(async ({ albumIndex, tiles, meta }) => {
      let indexText;
      switch (albumIndex) {
        case 64:
          indexText = '[last seen]';
          break;
        case 255:
          if (!importDeleted) {
            return null;
          }

          indexText = '[deleted]';
          break;
        default:
          displayIndex += 1;
          indexText = displayIndex.toString(10).padStart(2, '0');
          break;
      }

      const { dataHash: imageHash } = await compressAndHash(tiles);
      const { dataHash: frameHash } = await compressAndHashFrame(tiles);

      window.setImmediate(() => {
        const fName = typeof fileName === 'function' ?
          fileName({ indexText, albumIndex, displayIndex }) :
          `${fileName} ${indexText}`;
        dispatch({
          type: IMPORTQUEUE_ADD,
          payload: {
            fileName: fName,
            imageHash,
            frameHash,
            tiles,
            lastModified,
            meta,
            tempId: Math.random().toString(16).split('.').pop(),
          },
        });
      });

      return true;
    }));

    return true;
  };
};

export default getImportSav;
