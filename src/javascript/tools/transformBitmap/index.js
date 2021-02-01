import { saveFrameData } from '../applyFrame/frameData';
import readFileAs from '../readFileAs';

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

const getTransformBitmap = (dispatch) => (file) => {
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

    const [id, name, ext, empty] = file.name.split('.');

    if (
      name &&
      ext &&
      !empty &&
      id.match(/^[a-z]{2,}\d{2}$/g)
    ) {
      saveFrameData(id, tileLines)
        .then(() => {
          dispatch({
            type: 'ADD_FRAME',
            payload: {
              id,
              name,
            },
          });
        });
    }

    // This would import the file as gameboy image.
    // dispatch({
    //   type: 'SET_ALL_LINES',
    //   payload: {
    //     lines: tileLines,
    //     file: file.name.split('.').shift(),
    //   },
    // });
  };

  readFileAs(file, 'dataURL')
    .then((data) => {
      img.src = data;
    });
};

export default getTransformBitmap;
