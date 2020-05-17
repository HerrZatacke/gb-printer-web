import { load } from '../../../tools/storage';
import Decoder from '../../../tools/Decoder';
import zipFiles from '../../../tools/download';
import generateFileName from '../../../tools/generateFileName';

const startDownload = (store) => (next) => (action) => {

  if (action.type === 'START_DOWNLOAD') {
    const state = store.getState();

    const exportScaleFactors = state.exportScaleFactors;

    if (exportScaleFactors.length === 0) {
      return null;
    }

    const image = state.images.find(({ hash }) => hash === action.payload);
    const palette = state.palettes.find(({ shortName }) => shortName === image.palette);
    load(action.payload)
      .then((tiles) => {

        const canvas = document.createElement('canvas');
        canvas.width = 160;
        const decoder = new Decoder();
        decoder.update(canvas, palette.palette, tiles);

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

        Promise.all(images).then(zipFiles(generateFileName(image, palette)));
      });
  }

  return next(action);
};

export default startDownload;
