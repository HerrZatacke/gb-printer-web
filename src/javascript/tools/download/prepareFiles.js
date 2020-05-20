import Decoder from '../Decoder';
import generateFileName from '../generateFileName';
import download from './download';

const prepareFiles = (palette, exportScaleFactors, image) => (tiles) => {

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  const decoder = new Decoder();
  decoder.update(canvas, tiles, palette.palette);

  const images = exportScaleFactors.map((exportScaleFactor) => (
    new Promise((resolve, reject) => {

      const fileType = 'png';

      const filename = generateFileName(image, palette, exportScaleFactor);

      const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor);

      if (scaledCanvas.msToBlob) {
        window.navigator.msSaveBlob(scaledCanvas.msToBlob(), `${filename}.png`);
        return;
      }

      const onBlobComplete = (blob) => {
        if (typeof blob.arrayBuffer === 'function') {
          blob.arrayBuffer().then((arrayBuffer) => {
            resolve({
              filename: `${filename}.${fileType}`,
              arrayBuffer,
              blob,
            });
          });
        } else {
          const fileReader = new FileReader();
          fileReader.onload = (ev) => {
            resolve({
              filename: `${filename}.${fileType}`,
              arrayBuffer: ev.target.result,
              blob,
            });
          };

          fileReader.readAsArrayBuffer(blob);
        }
      };

      switch (fileType) {
        case 'png':
          scaledCanvas.toBlob(onBlobComplete, 'image/png');
          break;
        case 'jpg':
          scaledCanvas.toBlob(onBlobComplete, 'image/jpeg', 1);
          break;
        default:
          reject(new Error('could not export image'));
          break;
      }
    })
  ));

  Promise.all(images).then(download(generateFileName(image, palette)));
};

export default prepareFiles;
