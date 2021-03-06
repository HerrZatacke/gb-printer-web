import Queue from 'promise-queue';
import { saveAs } from 'file-saver';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';

const pluginsMiddleware = (store) => {
  const registeredPlugins = {};
  const queue = new Queue(1, Infinity);

  const progress = (progressValue) => {
    store.dispatch({
      type: 'EXECUTE_PLUGIN_PROGRESS',
      payload: progressValue % 1,
    });
  };

  const initPlugin = ({ url }) => {

    const pluginState = store.getState().plugins.find((plugin) => plugin.url === url) || {};
    const { config: stateConfig = {} } = pluginState;

    return (
      queue.add(() => (
        new Promise((resolve) => {
          window.gbpwRegisterPlugin = (Plugin) => {
            window.gbpwRegisterPlugin = () => {
            };

            try {
              const instance = new Plugin({ store }, stateConfig);
              instance.init({
                saveAs,
                progress,
              });
              const { name, description = '', configParams = {}, config = {} } = instance;
              registeredPlugins[url] = instance;
              store.dispatch({
                type: 'PLUGIN_UPDATE_PROPERTIES',
                payload: {
                  url,
                  name,
                  description,
                  configParams,
                  config,
                },
              });
              resolve(true);
            } catch (error) {
              console.warn(error);
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
  };

  const collectImageData = (hash) => {
    const state = store.getState();
    const { handleExportFrame } = state;
    const meta = state.images.find((image) => image.hash === hash);
    const selectedPalette = getImagePalette(state, meta);
    const getTiles = () => loadImageTiles(state)(meta);

    meta.isRGBN = !!meta.hashes;

    const getCanvas = ({
      scaleFactor = 1,
      palette = selectedPalette,
      lockFrame = meta.lockFrame || false,
      invertPalette = meta.invertPalette || false,
    } = {}) => (
      getTiles()
        .then((tiles) => {
          const decoder = meta.isRGBN ? new RGBNDecoder() : new Decoder();

          if (meta.isRGBN) {
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

          return decoder.getScaledCanvas(scaleFactor, handleExportFrame);
        })
    );

    return {
      getMeta: () => Promise.resolve(meta),
      getPalette: () => Promise.resolve(selectedPalette),
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

      case 'PLUGIN_IMAGES': {
        const { url } = action.payload;
        const { imageSelection } = store.getState();
        registeredPlugins[url].withSelection(imageSelection.map(collectImageData));
        break;
      }

      case 'PLUGIN_UPDATE_CONFIG': {
        const { url, config } = action.payload;
        registeredPlugins[url].setConfig(config);
        break;
      }

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
