import { load } from '../../../tools/storage';
import Decoder from '../../../tools/Decoder';

const startDownload = (store) => (next) => (action) => {

  if (action.type === 'START_DOWNLOAD') {
    const state = store.getState();

    const image = state.images.find(({ hash }) => hash === action.payload);
    const palette = state.palettes.find(({ shortName }) => shortName === image.palette);
    const tiles = load(action.payload);
    const exportScaleFactor = state.exportScaleFactors;
    const canvas = document.createElement('canvas');
    const filename = `${palette.shortName}-${image.title}`;

    canvas.width = 160;

    const decoder = new Decoder();
    decoder.update(canvas, palette.palette, tiles);

    const scaledCanvas = decoder.getScaledCanvas(exportScaleFactor);

    // ToDo: Optimize render and remove this timeout
    window.setTimeout(() => {
      if (scaledCanvas.msToBlob) {
        window.navigator.msSaveBlob(scaledCanvas.msToBlob(), `${filename}.png`);
      } else {
        const fileType = 'png';

        let imageData;
        switch (fileType) {
          case 'png':
            imageData = scaledCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            break;
          case 'jpg':
            imageData = scaledCanvas.toDataURL('image/jpeg', 1).replace('image/jpeg', 'image/octet-stream');
            break;
          default:
            break;
        }

        const download = document.createElement('a');
        download.setAttribute('href', imageData);
        download.setAttribute('download', `${filename}.${fileType}`);
        download.click();
      }
    }, 2);

  }

  return next(action);
};

export default startDownload;
