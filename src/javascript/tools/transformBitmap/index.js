import { saveFrameData } from '../applyFrame/frameData';
import readFileAs from '../readFileAs';
import saveNewImage from '../saveNewImage';
import getFrameGroups from '../getFrameGroups';

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

const frameId = ({ frameSetNew, frameSet, frameIndex }) => {
  const id = `${frameSetNew || frameSet}${frameIndex.padStart(2, '0')}`;
  return id.match(/^[a-z]{2,}\d{2}$/g) ? id : '';
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

    const frameGroups = getFrameGroups(store.getState().frames)
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

    store.dispatch({
      type: 'CONFIRM_ASK',
      payload: {
        message: `Choose how you want to import "${file.name}".`,
        questions: ({
          frameSet = '',
          frameSetNew = '',
          frameIndex = '',
          frameName = '',
        }) => (
          [
            {
              label: 'Add as frame to existing frameset',
              key: 'frameSet',
              type: 'select',
              options: frameGroups,
              disabled: !!frameSetNew,
            },
            {
              label: 'Create new frameset with ID (min. 2 chars)',
              key: 'frameSetNew',
              type: 'text',
              disabled: !!frameSet,
            },
            {
              label: 'Add or replace at index',
              key: 'frameIndex',
              type: 'number',
              disabled: !(frameSet || frameSetNew.length > 1),
            },
            {
              label: 'Name of frame',
              key: 'frameName',
              type: 'text',
              disabled: !(frameSet || frameSetNew.length > 1),
            },
            {
              label: frameId({ frameSet, frameSetNew, frameIndex }) && frameName ?
                `"${file.name}" will be imported as frame "${frameId({ frameSet, frameSetNew, frameIndex })}" - "${frameName}"` :
                `"${file.name}" will be imported as an image`,
              key: 'info',
              type: 'info',
            },
          ]
        ),
        confirm: ({ frameSet, frameSetNew, frameIndex, frameName }) => {

          if (
            frameName &&
            frameId({ frameSet, frameSetNew, frameIndex })
          ) {
            saveFrameData(frameId({ frameSet, frameSetNew, frameIndex }), tileLines)
              .then(() => {
                dispatch({
                  type: 'ADD_FRAME',
                  payload: {
                    id: frameId({ frameSet, frameSetNew, frameIndex }),
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
