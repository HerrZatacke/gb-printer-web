import { saveFrameData } from '../applyFrame/frameData';
import readFileAs from '../readFileAs';
import saveNewImage from '../saveNewImage';
import getFrameGroups from '../getFrameGroups';
import getQuestions from './questions';
import getFrameId from './getFrameId';

const getGreytone = ([r, g, b, a]) => {
  const greyTone = Math.floor((r + g + b) / 3 * (a / 255));

  // Black
  if (greyTone < 64) {
    return 0b0000000100000001;
  }

  if (greyTone < 128) {
    return 0b0000000000000001;
  }

  if (greyTone < 192) {
    return 0b0000000100000000;
  }

  // White
  return 0b00000000000000000;
};

const encodeTile = ({ data: imageData }) => {

  const line = [];
  for (let row = 0; row < 8; row += 1) {
    let rowData = 0;
    for (let col = 0; col < 8; col += 1) {
      const pixel = getGreytone(imageData.slice(((row * 8) + col) * 4));
      // eslint-disable-next-line no-bitwise
      rowData += pixel << (7 - col);
    }

    // eslint-disable-next-line no-bitwise
    line.push((rowData >> 8).toString(16).padStart(2, '0'), (rowData & 255).toString(16).padStart(2, '0'));
  }

  return line.join(' ').toUpperCase();
};

const getTransformBitmap = (store) => (file) => {
  const { dispatch } = store;
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const tileLines = [];

  canvas.width = 160;
  canvas.height = 144;

  img.onload = () => {
    context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, 160, 144);

    for (let row = 0; row < canvas.height; row += 8) {
      for (let col = 0; col < canvas.width; col += 8) {
        tileLines.push(encodeTile(context.getImageData(col, row, 8, 8)));
      }
    }

    const { frames } = store.getState();

    const frameGroups = getFrameGroups(frames)
      .filter(({ id }) => !['int', 'jp', 'hk'].includes(id))
      .map(({ id: value, name }) => ({
        value,
        name,
      }));

    frameGroups.unshift({
      value: '',
      name: 'Select',
      selected: true,
    });

    const frameIds = frames.map(({ id }) => id);

    store.dispatch({
      type: 'CONFIRM_ASK',
      payload: {
        message: `Choose how you want to import "${file.name}".`,
        questions: getQuestions({ frameIds, frameGroups, fileName: file.name }),
        confirm: ({ frameSet, frameSetNew, frameIndex, frameName }) => {
          const frameId = getFrameId({ frameSet, frameSetNew, frameIndex });

          if (frameId && frameName) {
            saveFrameData(frameId, tileLines)
              .then(() => {
                dispatch({
                  type: 'ADD_FRAME',
                  payload: {
                    id: frameId,
                    name: frameName,
                  },
                });
              });
          } else {
            saveNewImage({
              lines: tileLines,
              filename: file.name.split('.').shift(),
              palette: store.getState().activePalette,
            })
              .then((image) => {
                dispatch({
                  type: 'ADD_IMAGES',
                  payload: [image],
                });
              });
          }
        },
        deny: () => {
          dispatch({
            type: 'CONFIRM_ANSWERED',
          });
        },
      },
    });
  };

  readFileAs(file, 'dataURL')
    .then((data) => {
      img.src = data;
    });
};

export default getTransformBitmap;
