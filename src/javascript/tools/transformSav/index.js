import applyFrame from '../applyFrame';
import mapCartFrameToName from './mapCartFrameToName';
import getFrameGroups from '../getFrameGroups';

const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';

const transformImage = (data, baseAddress) => {
  const transformed = [];
  let currentLine = '';

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
      currentLine = '';
    }

    if (i % 256 === 255) {
      // add right frame placeholder
      transformed.push(...[...Array(2)].map(() => black));
    }
  }

  // add lower frame placeholder
  transformed.push(...[...Array(40)].map(() => black));

  return transformed;
};

const getTransformSav = (store) => (data, filename) => {
  const { savFrameTypes, frames } = store.getState();
  const framed = [];

  store.dispatch({
    type: 'CONFIRM_ASK',
    payload: {
      message: `Importing '${filename}'`,
      questions: [
        {
          label: 'Select frameset to use with this import',
          key: 'selectedFrameset',
          options: getFrameGroups(frames)
            .map(({ id: value, name }) => ({
              value,
              name,
              selected: savFrameTypes === value,
            })),
        },
      ],
      confirm: ({ selectedFrameset }) => {
        store.dispatch({
          type: 'CONFIRM_ANSWERED',
        });

        // Perform actual import action
        for (let i = 1; i <= 30; i += 1) {
          const baseAddress = (i + 1) * 0x1000;
          const frameNumber = data[baseAddress + 0xfb0];
          const transformedData = transformImage(data, baseAddress);
          framed.push(applyFrame(transformedData, mapCartFrameToName(frameNumber, selectedFrameset, frames)));
        }

        Promise.all(framed)
          .then((framedImages) => {
            framedImages.forEach((framedImage) => {
              store.dispatch({
                type: 'ADD_TO_QUEUE',
                payload: [{
                  file: filename,
                  lines: framedImage,
                }],
              });
            });
          });
      },
      deny: () => {
        store.dispatch({
          type: 'CONFIRM_ANSWERED',
        });
      },
    },
  });

};

export default getTransformSav;
