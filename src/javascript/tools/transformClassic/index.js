import handleLines from '../handleLines';
import { terminatorLine } from '../../app/defaults';
import { IMAGE_COMPLETE, NEW_LINES } from '../handleLines/types';

const transformClassic = (data, filename) => {

  let dataLines = [];

  const imagesFromFile = `${data}\n${terminatorLine}`.split('\n')
    .map(handleLines)
    .filter(Boolean)
    .map((lineAction) => {

      switch (lineAction.type) {
        case NEW_LINES:
          dataLines.push(...lineAction.payload);
          return null;

        case IMAGE_COMPLETE:
          // eslint-disable-next-line no-case-declarations
          const lines = dataLines.filter(Boolean);
          dataLines = [];
          return lines.length ? lines : false;

        default:
          return null;
      }

    })
    .filter(Boolean);

  if (!imagesFromFile.length) {
    console.warn(`File ${filename} did not contain images`);
  }

  return Promise.resolve(imagesFromFile);
};

export default transformClassic;
