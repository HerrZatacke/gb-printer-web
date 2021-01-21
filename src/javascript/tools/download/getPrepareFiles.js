import Decoder from '../Decoder';
import RGBNDecoder from '../RGBNDecoder';
import generateFileName from '../generateFileName';

const getPrepareFiles = (exportScaleFactors, exportFileTypes, exportCropFrame) => (palette, image) => (tiles) => {

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

        const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor, exportCropFrame);

        if (scaledCanvas.msToBlob) {
          window.navigator.msSaveBlob(scaledCanvas.msToBlob(), `${filename}.png`);
          return;
        }

        const onBlobComplete = (blob) => {
          if (typeof blob.arrayBuffer === 'function') {
            blob.arrayBuffer()
              .then((arrayBuffer) => {
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

        scaledCanvas.toBlob(onBlobComplete, `image/${fileType}`, 1);

      })
    ))
  ));

  return Promise.all(images.flat());
};

export default getPrepareFiles;
