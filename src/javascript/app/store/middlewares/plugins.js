import Queue from 'promise-queue';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';

const pluginsMiddleware = (store) => {
  const registeredPlugins = {};
  const queue = new Queue(1, Infinity);

  const initPlugin = ({ url }) => (
    queue.add(() => (
      new Promise((resolve) => {
        window.gbpwRegisterPlugin = (Plugin) => {
          window.gbpwRegisterPlugin = () => {};

          try {
            const instance = new Plugin({ store });
            instance.init();
            const { name, description } = instance;
            registeredPlugins[url] = instance;
            store.dispatch({
              type: 'PLUGIN_UPDATE_PROPERTIES',
              payload: {
                url,
                name,
                description,
              },
            });
            resolve(true);
          } catch (error) {
            resolve(false);
          }
        };

        // init loading of external script.
        const pluginScript = document.createElement('script');
        document.head.appendChild(pluginScript);
        pluginScript.src = url;
      })
    ))
  );

  const collectImageData = (hash) => {
    const state = store.getState();
    const meta = state.images.find((image) => image.hash === hash);
    const palette = getImagePalette(state, meta);
    const getTiles = () => loadImageTiles(meta, state);

    const getCanvas = (scaleFactor = 1, cropFrame = false) => (
      getTiles()
        .then((tiles) => {
          const isRGBN = !!meta.hashes;
          const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
          const lockFrame = meta.lockFrame || false;
          const invertPalette = meta.invertPalette || false;

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

          return decoder.getScaledCanvas(scaleFactor, cropFrame);
        })
    );

    return {
      meta,
      palette,
      getTiles,
      getCanvas,
    };
  };

  window.requestAnimationFrame(() => {
    const { plugins } = store.getState();

    Promise.all(plugins.map(initPlugin))
      .then((initializedPlugins) => {
        // eslint-disable-next-line no-console
        console.log(`${initializedPlugins.filter(Boolean).length} plugins initialized`);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  return (next) => (action) => {

    switch (action.type) {
      case 'PLUGIN_IMAGE': {
        const { url, hash } = action.payload;
        registeredPlugins[url].withImage(collectImageData(hash));
        break;
      }

      case 'PLUGIN_IMAGES':
        // eslint-disable-next-line no-alert
        alert('not yet implemented');
        break;

      case 'PLUGIN_ADD':
        initPlugin({
          url: action.payload,
        });
        break;

      case 'PLUGIN_REMOVE':
        delete registeredPlugins[action.payload];
        break;

      default:
        break;
    }

    next(action);
  };
};

export default pluginsMiddleware;
