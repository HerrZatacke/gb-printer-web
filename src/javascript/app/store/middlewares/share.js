import { getPrepareFiles } from '../../../tools/download';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';

const batch = (store) => (next) => (action) => {

  if (action.type === 'SHARE_IMAGE') {
    const state = store.getState();

    const image = state.images.find(({ hash }) => hash === action.payload);
    const imagePalette = getImagePalette(state, image);

    const shareScaleFactor = [...state.exportScaleFactors].pop() || 4;
    const shareFileType = [...state.exportFileTypes].pop() || 'png';

    const prepareFiles = getPrepareFiles([shareScaleFactor], [shareFileType]);

    loadImageTiles(image, state)
      .then(prepareFiles(imagePalette, image))
      .then((res) => {

        const { blob, filename, title } = res[0];

        let shareData;

        try {
          shareData = {
            files: [new File([blob], filename, { type: 'image/png', lastModified: new Date() })],
            title,
          };
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify({ s: 1, error }));
        }

        if (shareData && window.navigator.share) {
          try {
            window.navigator.share(shareData)
              // eslint-disable-next-line no-alert
              .catch((error) => alert(JSON.stringify({ s: 3, error })));
          } catch (error) {
            // eslint-disable-next-line no-alert
            alert(JSON.stringify({ s: 4, error }));
          }
        } else {
          // eslint-disable-next-line no-alert
          alert(`sharing not enabled in your browser... because:
share is: ${typeof window.navigator.share}
shareData is: ${typeof shareData}
canShare is: ${typeof window.navigator.canShare}
canShare says: ${window.navigator.canShare ? window.navigator.canShare(shareData) : ''}`);
        }

      });
  }

  next(action);
};

export default batch;
