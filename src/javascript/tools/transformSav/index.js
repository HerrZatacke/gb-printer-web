import applyFrame from '../applyFrame';
import mapCartFrameToName from './mapCartFrameToName';
import getFrameGroups from '../getFrameGroups';
import sortBy from '../sortby';

const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';
const white = '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00';

const sortByAlbumIndex = sortBy('albumIndex');

const transformImage = (data, baseAddress) => {
  const transformed = [];
  let currentLine = '';
  let hasData = false;

  // add black upper frame placeholder
  transformed.push(...[...Array(40)].map(() => black));

  for (let i = 0; i < 0x0E00; i += 1) {
    if (i % 256 === 0) {
      // add left frame placeholder
      transformed.push(...[...Array(2)].map(() => black));
    }

    currentLine += ` ${data[baseAddress + i].toString(16)
      .padStart(2, '0')}`;

    if (i % 16 === 15) {
      transformed.push(currentLine.trim());

      // track if an image has actual data inside to prevent iimporting the "white" image all the time
      if (!hasData && currentLine.trim() !== white) {
        hasData = true;
      }

      currentLine = '';
    }

    if (i % 256 === 255) {
      // add right frame placeholder
      transformed.push(...[...Array(2)].map(() => black));
    }
  }

  // add lower frame placeholder
  transformed.push(...[...Array(40)].map(() => black));

  return hasData ? transformed : null;
};

const getTransformSav = (store) => (data, filename) => {
  const { savFrameTypes, frames, importLastSeen } = store.getState();

  const framed = [];

  const frameGroups = getFrameGroups(frames)
    .map(({ id: value, name }) => ({
      value,
      name,
      selected: savFrameTypes === value,
    }));


  const getFileMeta = (baseAddress) => {
    const cartIndex = (baseAddress / 0x1000) - 2;
    const albumIndex = cartIndex >= 0 ? data[0x11b2 + cartIndex] : 64;

    return {
      cartIndex,
      albumIndex,
      baseAddress,
    };
  };

  const importSav = (selectedFrameset) => {
    for (let baseAddress = 0; baseAddress < 0x20000; baseAddress += 0x1000) {

      if (
        (importLastSeen && baseAddress === 0) ||
        (baseAddress >= 0x2000) // Ignore the "Game Face" at 0x1000
      ) {
        const frameNumber = data[baseAddress + 0xfb0];
        const transformedData = transformImage(data, baseAddress);

        if (transformedData) {
          framed.push(
            applyFrame(transformedData, mapCartFrameToName(frameNumber, selectedFrameset, frames))
              .then((lines) => ({
                lines,
                ...getFileMeta(baseAddress),
              })),
          );
        }
      }
    }

    return Promise.all(framed)
      .then(sortByAlbumIndex)
      .then((sortedImages) => {
        let displayIndex = 0;
        return sortedImages.map(({ albumIndex, lines }) => {
          let indexText;
          switch (albumIndex) {
            case 64:
              indexText = '[last seen]';
              break;
            case 255:
              indexText = '[deleted]';
              break;
            default:
              displayIndex += 1;
              indexText = displayIndex.toString(10).padStart(2, '0');
              break;
          }

          return {
            lines,
            file: `${filename} ${indexText}`,
          };
        });
      });
  };

  if (frameGroups.length < 2) {
    return importSav(savFrameTypes);
  }

  return new Promise(((resolve) => {

    store.dispatch({
      type: 'CONFIRM_ASK',
      payload: {
        message: `Importing '${filename}'`,
        questions: () => [
          {
            label: 'Select frameset to use with this import',
            key: 'selectedFrameset',
            type: 'select',
            options: frameGroups,
          },
        ],
        confirm: ({ selectedFrameset }) => {
          store.dispatch({
            type: 'CONFIRM_ANSWERED',
          });

          // Perform actual import action
          resolve(importSav(selectedFrameset));
        },
        deny: () => {
          store.dispatch({
            type: 'CONFIRM_ANSWERED',
          });
          resolve([]);
        },
      },
    });
  }));

};

export default getTransformSav;
