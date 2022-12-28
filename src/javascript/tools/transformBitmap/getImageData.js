import readFileAs from '../readFileAs';

/* eslint-disable no-param-reassign */
const prepareContext = (context) => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.filter = 'grayscale(1)';
  context.imageSmoothingEnabled = false;
};
/* eslint-enable no-param-reassign */

const getImageData = (file) => (
  new Promise((resolve, reject) => {
    const img = document.createElement('img');

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = 160;

    const context = srcCanvas.getContext('2d');

    img.onerror = reject;

    img.onload = () => {
      let scaleFactor;
      const srcWidth = img.naturalWidth;
      const srcHeight = img.naturalHeight;
      const ratio = srcHeight / srcWidth;

      // if an image has the ratio of the "sensor" resolution of 128x112, import it inside of a frame
      if (ratio === 112 / 128) {
        srcCanvas.height = 144;
        scaleFactor = img.naturalWidth / 128;
        prepareContext(context);
        context.drawImage(img, 0, 0, srcWidth, srcHeight, 16, 16, srcCanvas.width - 32, srcCanvas.height - 32);
      } else {
        srcCanvas.height = srcCanvas.width * srcHeight / srcWidth;
        scaleFactor = srcWidth / 160;
        prepareContext(context);
        context.drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, srcCanvas.width, srcCanvas.height);
      }

      const imageData = context.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

      resolve({
        imageData,
        scaleFactor,
        width: srcCanvas.width,
        height: srcCanvas.height,
        fileName: file.name,
      });
    };

    readFileAs(file, 'dataURL')
      .then((data) => {
        img.src = data;
      });
  })
);

export default getImageData;
