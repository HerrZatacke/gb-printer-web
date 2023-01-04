import Decoder from '../Decoder';
import RGBNDecoder from '../RGBNDecoder';
import generateFileName from '../generateFileName';
import { load } from '../storage';
import { finalLine, initLine, moreLine, terminatorLine } from '../../app/defaults';
import applyRotation from '../applyRotation';

const getPrepareFiles = (state) => (palette, image) => (tiles) => {
  const { exportScaleFactors, exportFileTypes, handleExportFrame } = state;

  const isRGBN = !!image.hashes;
  const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
  const lockFrame = image.lockFrame || false;
  const invertPalette = image.invertPalette || false;
  const rotation = image.rotation || 0;

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
        switch (fileType) {
          case 'txt': {
            // not for rgbn images
            if (isRGBN) {
              resolve(null);
              return;
            }

            // this loads the basic raw data without applying a frame
            load(image.hash, null)
              .then((plainTiles) => {

                const transformedTiles = plainTiles
                  // add spaces between every second char
                  .map((line) => (
                    line.match(/.{1,2}/g)
                      .join(' ')
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
            break;
          }

          case 'pgm': {
            // not for rgbn images
            if (isRGBN) {
              resolve(null);
              return;
            }

            const tempCanvas = decoder.getScaledCanvas(1, handleExportFrame);
            const canvas = document.createElement('canvas');
            applyRotation(tempCanvas, canvas, rotation);

            const pgm = [
              'P2',
              '#',
              `# Exported from ${window.location.origin}`,
              '#',
              `# hash: ${image.hash}`,
              `# created: ${image.created}`,
              `# title: ${image.title}`,
              `# tags: ${image.tags.join(', ')}`,
              `# dimension: ${canvas.width}*${canvas.height} pixels`,
              '#',
              `${canvas.width} ${canvas.height}`,
              '3', // 4 greyscale values (0-3)
              '#',
            ];

            const context = canvas.getContext('2d');

            for (let y = 0; y < canvas.height; y += 1) {
              const line = [];
              for (let x = 0; x < canvas.width; x += 1) {

                const imageData = context.getImageData(x, y, 1, 1).data;

                const hexColor = [
                  '#',
                  imageData[0].toString(16).padStart(2, '0'),
                  imageData[1].toString(16).padStart(2, '0'),
                  imageData[2].toString(16).padStart(2, '0'),
                ].join('');

                let colorIndex = palette.palette.indexOf(hexColor);

                if (colorIndex === -1) {
                  colorIndex = decoder.bwPalette.indexOf(parseInt(hexColor.slice(1), 16));
                }

                line.push(3 - colorIndex);
              }

              pgm.push(line.join(' '));
            }

            resolve({
              filename: `${filename}.${fileType}`,
              blob: new Blob([pgm.join('\n')], {
                type: 'text/plain',
              }),
              title: image.title,
            });

            break;
          }

          default: {
            const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor, handleExportFrame);
            const canvas = document.createElement('canvas');
            applyRotation(scaledCanvas, canvas, rotation);

            const onBlobComplete = (blob) => {
              resolve({
                filename: `${filename}.${fileType}`,
                blob,
                title: image.title,
              });
            };

            canvas.toBlob(onBlobComplete, `image/${fileType}`, 1);
            break;
          }
        }
      })
    ))
  ));

  return Promise.all(images.flat())
    .then((files) => files.filter(Boolean));
};

export default getPrepareFiles;
