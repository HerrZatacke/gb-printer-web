import Decoder from '../Decoder';
import RGBNDecoder from '../RGBNDecoder';
import generateFileName from '../generateFileName';
import { load } from '../storage';
import { finalLine, initLine, moreLine, terminatorLine } from '../../app/defaults';

const getPrepareFiles = (state) => (palette, image) => (tiles) => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame } = state;

  const isRGBN = !!image.hashes;
  const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
  const lockFrame = image.lockFrame || false;
  const invertPalette = image.invertPalette || false;

  if (isRGBN) {
    decoder.update({
      tiles,
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

              const transformedTiles = plainTiles
                // add spaces between every second char
                .map((line) => (
                  line.match(/.{1,2}/g).join(' ')
                ))
                .reduce((acc, line, index) => {
                  if (index % 40) {
                    return [...acc, line];
                  }

                  return [...acc, moreLine, line];
                }, []);

              const textContent = [
                initLine,
                ...transformedTiles,
                finalLine,
                terminatorLine,
              ].join('\n');

              // toDownload
              resolve({
                folder: 'images', // used for Git-Sync
                filename: `${filename}.${fileType}`,
                blob: new Blob(new Array(textContent), { type: 'text/plain' }),
                title: image.title,
              });
            });
        } else {
          const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor, handleExportFrame);

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
