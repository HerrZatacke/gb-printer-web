import Decoder from '../Decoder';
import RGBNDecoder from '../RGBNDecoder';
import generateFileName from '../generateFileName';

const getPrepareFiles = (exportScaleFactors) => (palette, image) => (tiles) => {

  const canvas = document.createElement('canvas');
  canvas.width = 160;

  const isRGBN = !!image.hashes;
  const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
  const lockFrame = image.lockFrame || false;

  if (isRGBN) {
    decoder.update(canvas, RGBNDecoder.rgbnTiles(tiles), palette, lockFrame);
  } else {
    decoder.update(canvas, tiles, palette.palette, lockFrame);
  }

  const images = exportScaleFactors.map((exportScaleFactor) => (
    new Promise((resolve, reject) => {

      const fileType = 'png';

      const filename = generateFileName({
        image,
        palette,
        exportScaleFactor,
      });

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
              title: image.title,
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

  return Promise.all(images);
};

export default getPrepareFiles;
