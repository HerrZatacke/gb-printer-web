import { load } from '../../../tools/storage';
import Decoder from '../../../tools/Decoder';
import zipFiles from '../../../tools/download';

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

        const fileTitle = `${palette.shortName}-${image.title}`;
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        const decoder = new Decoder();
        decoder.update(canvas, palette.palette, tiles);

        const images = exportScaleFactors.map((exportScaleFactor) => (
          new Promise((resolve, reject) => {

            const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor);

            if (scaledCanvas.msToBlob) {
              window.navigator.msSaveBlob(scaledCanvas.msToBlob(), `${fileTitle}.png`);
              return;
            }

            const fileType = 'png';

            const onBlobComplete = (blob) => {
              const filename = `${exportScaleFactor}x-${fileTitle}.${fileType}`;
              if (typeof blob.arrayBuffer === 'function') {
                blob.arrayBuffer().then((arrayBuffer) => {
                  resolve({
                    filename,
                    arrayBuffer,
                    blob,
                  });
                });
              } else {
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                  resolve({
                    filename,
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

        Promise.all(images).then(zipFiles(fileTitle));
      });
  }

  return next(action);
};

export default startDownload;
