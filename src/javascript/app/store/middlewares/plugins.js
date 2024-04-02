import Queue from 'promise-queue';
import { saveAs } from 'file-saver';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';
import { Actions } from '../actions';
import applyRotation from '../../../tools/applyRotation';

const pluginsMiddleware = (store) => {
  const registeredPlugins = {};
  const queue = new Queue(1, Infinity);

  const progress = (progressValue) => {
    store.dispatch({
      type: Actions.EXECUTE_PLUGIN_PROGRESS,
      payload: progressValue % 1,
    });
  };

  const collectImageData = (hash) => {
    const state = store.getState();
    const { handleExportFrame: handleExportFrameState } = state;
    const meta = state.images.find((image) => image.hash === hash);
    const selectedPalette = getImagePalette(state, meta);
    const getTiles = () => loadImageTiles(state)(meta);

    meta.isRGBN = !!meta.hashes;

    const getCanvas = ({
      scaleFactor = 1,
      palette = selectedPalette,
      lockFrame = meta.lockFrame || false,
      invertPalette = meta.invertPalette || false,
      handleExportFrame = handleExportFrameState,
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

          const tempCanvas = decoder.getScaledCanvas(scaleFactor, handleExportFrame);
          const canvas = document.createElement('canvas');
          applyRotation(tempCanvas, canvas, meta.rotation);

          return canvas;
        })
    );

    return {
      getMeta: () => Promise.resolve(meta),
      getPalette: () => Promise.resolve(selectedPalette),
      getTiles,
      getCanvas,
    };
  };

  const initPlugin = (plugin) => {

    const pluginState = store.getState().plugins.find(({ url }) => plugin.url === url) || {};
    const { config: stateConfig = {} } = pluginState;
    const { url } = plugin;

    return (
      queue.add(() => (
        new Promise((resolve) => {
          window.gbpwRegisterPlugin = (Plugin) => {
            window.gbpwRegisterPlugin = () => { /* noop */ };

            try {
              const instance = new Plugin({
                saveAs,
                progress,
                store,
                collectImageData,
              }, stateConfig);
              const { name, description = '', configParams = {}, config = {} } = instance;
              registeredPlugins[url] = instance;
              store.dispatch({
                type: Actions.PLUGIN_UPDATE_PROPERTIES,
                payload: {
                  url,
                  name,
                  description,
                  configParams,
                  config,
                  loading: false,
                  error: false,
                },
              });
              resolve(true);
            } catch (error) {
              store.dispatch({
                type: Actions.PLUGIN_UPDATE_PROPERTIES,
                payload: {
                  url,
                  loading: false,
                  error: error.message,
                },
              });
              resolve(false);
            }
          };

          // init loading of external script.
          const pluginScript = document.createElement('script');
          document.head.appendChild(pluginScript);

          pluginScript.addEventListener('error', () => {
            window.gbpwRegisterPlugin = () => { /* noop */ };

            store.dispatch({
              type: Actions.PLUGIN_UPDATE_PROPERTIES,
              payload: {
                url,
                loading: false,
                error: 'Loading error',
              },
            });
            resolve(false);
          });

          pluginScript.src = url;
        })
      ))
    );
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
      case Actions.PLUGIN_IMAGE: {
        const { url, hash } = action.payload;
        registeredPlugins[url].withImage(collectImageData(hash));
        break;
      }

      case Actions.PLUGIN_IMAGES: {
        const { url } = action.payload;
        const { imageSelection } = store.getState();
        registeredPlugins[url].withSelection(imageSelection.map(collectImageData));
        break;
      }

      case Actions.PLUGIN_UPDATE_CONFIG: {
        const { url, config } = action.payload;
        registeredPlugins[url].setConfig(config);
        break;
      }

      case Actions.PLUGIN_ADD:
        initPlugin({
          url: action.payload,
        });
        break;

      case Actions.PLUGIN_REMOVE:
        delete registeredPlugins[action.payload];
        break;

      default:
        break;
    }

    next(action);
  };
};

export default pluginsMiddleware;
