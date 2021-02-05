import Decoder from '../Decoder';
import RGBNDecoder from '../RGBNDecoder';
import generateFileName from '../generateFileName';
import { load } from '../storage';

const getPrepareFiles = (state) => (palette, image) => (tiles) => {
  const { exportScaleFactors, exportFileTypes, exportCropFrame } = state;

  const isRGBN = !!image.hashes;
  const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
  const lockFrame = image.lockFrame || false;
  const invertPalette = image.invertPalette || false;

  if (isRGBN) {
    decoder.update({
      tiles: RGBNDecoder.rgbnTiles(tiles),
      palette,
      lockFrame,
    });
  } else {
    decoder.update({
      tiles,
      palette: palette.palette,
      lockFrame,
      invertPalette,
    });
  }

  const validExportScaleFactors = [...exportScaleFactors].filter((factor) => (
    typeof factor === 'number'
  ));

  const validExportFileTypes = [...exportFileTypes];

  if (!validExportScaleFactors.length) {
    validExportScaleFactors.push(4);
  }

  if (!validExportFileTypes.length) {
    validExportFileTypes.push('png');
  }

  const images = validExportScaleFactors.map((exportScaleFactor) => (
    validExportFileTypes.map((fileType) => (
      new Promise((resolve) => {

        const filename = generateFileName({
          image,
          palette,
          exportScaleFactor,
        });

        // export the raw tildata of an image
        if (fileType === 'txt') {

          // not for rgbn images
          if (image.hashes) {
            resolve(null);
            return;
          }

          load(image.hash, null)
            .then((plainTiles) => {

              const encoder = new TextEncoder();
              const arrayBuffer = encoder.encode(plainTiles.join('\n'));
              const blob = new Blob(arrayBuffer, { type: 'text/plain' });

              resolve({
                filename: `${filename}.${fileType}`,
                arrayBuffer, // used by download()
                blob, // used by everything else
                title: image.title,
              });
            });
        }

        const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor, exportCropFrame);

        const onBlobComplete = (blob) => {
          if (typeof blob.arrayBuffer === 'function') {
            blob.arrayBuffer()
              .then((arrayBuffer) => {
                resolve({
                  filename: `${filename}.${fileType}`,
                  arrayBuffer, // used by download()
                  blob, // used by everything else
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

        scaledCanvas.toBlob(onBlobComplete, `image/${fileType}`, 1);

      })
    ))
  ));

  return Promise.all(images.flat())
    .then((files) => files.filter(Boolean));
};

export default getPrepareFiles;
