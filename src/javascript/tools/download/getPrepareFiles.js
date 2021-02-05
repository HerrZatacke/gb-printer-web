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

          // this loads the basic raw data without applying a frame
          load(image.hash, null)
            .then((plainTiles) => {
              resolve({
                filename: `${filename}.${fileType}`,
                blob: new Blob(new Array(plainTiles.join('\n')), { type: 'text/plain' }),
                title: image.title,
              });
            });
        } else {
          const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor, exportCropFrame);

          const onBlobComplete = (blob) => {
            resolve({
              filename: `${filename}.${fileType}`,
              blob,
              title: image.title,
            });
          };

          scaledCanvas.toBlob(onBlobComplete, `image/${fileType}`, 1);
        }
      })
    ))
  ));

  return Promise.all(images.flat())
    .then((files) => files.filter(Boolean));
};

export default getPrepareFiles;
