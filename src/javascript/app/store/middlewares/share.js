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

        const canvas = res[0].canvas;

        if (window.navigator.share && canvas) {

          try {
            window.navigator.share({
              url: canvas.toDataURL('png', 1),
              title: 'shary',
            })
              // eslint-disable-next-line no-alert
              .then((success) => alert(success))
              // eslint-disable-next-line no-alert
              .catch((error) => alert(error));
          } catch (error) {
            // eslint-disable-next-line no-alert
            alert(error);
          }
        } else {
          // eslint-disable-next-line no-alert
          alert(typeof window.navigator.share);
          // eslint-disable-next-line no-console
          console.log(res[0].canvas);
        }

      });
  }

  next(action);
};

export default batch;
