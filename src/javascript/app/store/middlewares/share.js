import { load } from '../../../tools/storage';
import getRGBNFrames from '../../../tools/getRGBNFrames';
import { getPrepareFiles } from '../../../tools/download';

const getImagePalette = ({ palettes }, { hashes, palette }) => (
  (!hashes) ? palettes.find(({ shortName }) => shortName === palette) : palette
);

const loadImageTiles = ({ hash, frame, hashes }, state) => {
  if (!hashes) {
    return load(hash, frame);
  }

  const frames = getRGBNFrames(state, hashes, frame);

  return Promise.all([
    load(hashes.r, frames.r || frame),
    load(hashes.g, frames.g || frame),
    load(hashes.b, frames.b || frame),
    load(hashes.n, frames.n || frame),
  ]);
};


const batch = (store) => (next) => (action) => {

  if (action.type === 'SHARE_IMAGE') {
    const state = store.getState();

    const image = state.images.find(({ hash }) => hash === action.payload);
    const imagePalette = getImagePalette(state, image);

    const shareScaleFactor = [...state.exportScaleFactors].pop();

    const prepareFiles = getPrepareFiles([shareScaleFactor]);

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

        if (shareData && window.navigator.canShare && window.navigator.canShare(shareData)) {
          try {
            window.navigator.share(shareData)
              // eslint-disable-next-line no-alert
              .then(() => alert('success'))
              // eslint-disable-next-line no-alert
              .catch((error) => alert(JSON.stringify({ s: 3, error })));
          } catch (error) {
            // eslint-disable-next-line no-alert
            alert(JSON.stringify({ s: 4, error }));
          }
        } else {
          // eslint-disable-next-line no-alert
          alert('sharing not enabled in your browser');
        }

      });
  }

  next(action);
};

export default batch;
