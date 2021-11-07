import chunk from 'chunk';
import { saveFrameData } from '../applyFrame/frameData';
import readFileAs from '../readFileAs';
import saveNewImage from '../saveNewImage';
import getFrameGroups from '../getFrameGroups';
import getQuestions from './questions';
import getFrameId from './getFrameId';
import sortBy from '../sortby';
import { ADD_FRAME, ADD_IMAGES, CONFIRM_ANSWERED, CONFIRM_ASK } from '../../app/store/actions';

const sortByCount = sortBy('count', 'desc');
const sortByThreshold = sortBy('threshold');

// bins to detect several grey levels (histogram analysis)
const BINS = 7;

const getGreytoneTh = (thresholds) => ([r,,, a]) => {
  const greyTone = Math.floor(r * (a / 255));

  // Black
  if (greyTone < thresholds[0]) {
    return 0b0000000100000001;
  }

  if (greyTone < thresholds[1]) {
    return 0b0000000000000001;
  }

  if (greyTone < thresholds[2]) {
    return 0b0000000100000000;
  }

  // White
  return 0b00000000000000000;
};

const getThresholds = ({ data }) => {
  const tones = chunk(data, 4)
    .map(([r,,, a]) => (
      Math.floor(r * (a / 255))
    ));

  // not possible due to max callstack size
  // const min = Math.min(...tones);
  // const max = Math.max(...tones);
  const min = tones.reduce((prev, current) => (prev < current ? prev : current), 255);
  const max = tones.reduce((prev, current) => (prev > current ? prev : current), 0);

  const conditions = [...new Array(BINS)]
    .map((_, index) => ({
      threshold: Math.ceil((max - min) / (BINS / (index + 1))) + min,
      count: 0,
    }));

  tones.forEach((tone) => {
    for (let i = 0; i < BINS; i += 1) {
      if (
        (tone > (conditions?.[i - 1]?.threshold || -1)) &&
        (tone <= conditions[i].threshold)
      ) {
        conditions[i].count += 1;
      }
    }
  });

  const thresholds = sortByThreshold(
    // get 4 largest thresholds
    sortByCount(conditions).slice(0, 4),
  // and in the end remove the highest one
  ).slice(0, 3);

  return thresholds.map(({ threshold }) => threshold);
};

const encodeTileTh = (thresholds) => {
  const getGreytone = getGreytoneTh(thresholds);

  return ({ data: imageData }) => {

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

    return line.join(' ')
      .toUpperCase();
  };
};

const getTransformBitmap = (store) => (file, fromPrinter = false) => {
  const { dispatch } = store;
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const tileLines = [];

  img.onload = () => {
    context.filter = 'grayscale(1)';

    canvas.width = 160;
    canvas.height = canvas.width * img.naturalHeight / img.naturalWidth;

    // if an image has the "sensor" resolution of 128x112, import it inside a black frame
    if (img.naturalWidth === 128 && img.naturalHeight === 112) {
      context.drawImage(img, 16, 16);
    } else {
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
    }

    const thresholds = getThresholds(context.getImageData(0, 0, canvas.width, canvas.height));

    const encodeTile = encodeTileTh(thresholds);

    for (let row = 0; row < canvas.height; row += 8) {
      for (let col = 0; col < canvas.width; col += 8) {
        tileLines.push(encodeTile(context.getImageData(col, row, 8, 8)));
      }
    }

    const saveImage = () => {
      saveNewImage({
        lines: tileLines,
        filename: file.name?.split('.').shift() || '',
        palette: store.getState().activePalette,
      })
        .then((image) => {
          dispatch({
            type: ADD_IMAGES,
            payload: [image],
          });
        });
    };

    if (fromPrinter) {
      saveImage();
      return;
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
      type: CONFIRM_ASK,
      payload: {
        message: `Choose how you want to import "${file.name}".`,
        questions: getQuestions({ frameIds, frameGroups, fileName: file.name }),
        confirm: ({ frameSet, frameSetNew, frameIndex, frameName }) => {
          const frameId = getFrameId({ frameSet, frameSetNew, frameIndex });

          if (frameId && frameName) {
            saveFrameData(frameId, tileLines)
              .then((hash) => {
                dispatch({
                  type: ADD_FRAME,
                  payload: {
                    id: frameId,
                    name: frameName,
                    hash,
                  },
                });
              });
          } else {
            saveImage();
          }
        },
        deny: () => {
          dispatch({
            type: CONFIRM_ANSWERED,
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
