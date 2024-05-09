import Queue from 'promise-queue';
import { saveAs } from 'file-saver';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';
import { Actions } from '../actions';
import applyRotation from '../../../tools/applyRotation';
import { isRGBNImage } from '../../../tools/isRGBNImage';
import { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import { RGBNPalette } from '../../../../types/Image';
import { Palette } from '../../../../types/Palette';
import { RGBNTile } from '../../../tools/Decoder/types';
import { Plugin, PluginArgs, PluginClassInstance, PluginConfigValues, PluginImageData } from '../../../../types/Plugin';
import { TypedStore } from '../State';

interface RegisteredPlugins {
  [url: string]: PluginClassInstance,
}

declare global {
  interface Window {
    gbpwRegisterPlugin: (PluginClass: { new (
      config: PluginArgs<TypedStore>,
      stateConfig: PluginConfigValues,
    ): PluginClassInstance }) => void;
  }
}

const pluginsMiddleware: MiddlewareWithState = (store) => {
  const registeredPlugins: RegisteredPlugins = {};
  const queue = new Queue(1, Infinity);

  const progress = (progressValue: number): void => {
    store.dispatch({
      type: Actions.EXECUTE_PLUGIN_PROGRESS,
      payload: progressValue % 1,
    });
  };

  const collectImageData = (hash: string): PluginImageData => {
    const state = store.getState();
    const { handleExportFrame: handleExportFrameState } = state;

    const meta = state.images.find((image) => image.hash === hash);
    if (!meta) {
      throw new Error('image not found');
    }

    const selectedPalette = getImagePalette(state, meta);
    if (!selectedPalette) {
      throw new Error('selectedPalette not found');
    }

    const getTiles = () => loadImageTiles(state)(meta);

    const isRGBN = isRGBNImage(meta);

    const getCanvas = async ({
      scaleFactor = 1,
      palette = selectedPalette,
      lockFrame = meta.lockFrame || false,
      invertPalette = meta.invertPalette || false,
      handleExportFrame = handleExportFrameState,
    } = {}): Promise<HTMLCanvasElement> => {
      const tiles = await getTiles();
      let decoder: RGBNDecoder | Decoder;

      if (isRGBN) {
        decoder = new RGBNDecoder();
        decoder.update({
          canvas: null,
          tiles: tiles as RGBNTile[],
          palette: palette as RGBNPalette,
          lockFrame,
        });
      } else {
        decoder = new Decoder();
        decoder.update({
          canvas: null,
          tiles: tiles as string[],
          palette: (palette as Palette).palette as string[],
          lockFrame,
          invertPalette,
        });
      }

      const tempCanvas = decoder.getScaledCanvas(scaleFactor, handleExportFrame);
      const canvas = document.createElement('canvas');
      applyRotation(tempCanvas, canvas, meta.rotation || 0);

      return canvas;
    };

    return {
      getMeta: async () => ({ ...meta, isRGBN }),
      getPalette: async () => (selectedPalette),
      getTiles,
      getCanvas,
    };
  };

  const initPlugin = (plugin: Plugin) => {
    const pluginState = store.getState().plugins.find(({ url }) => plugin.url === url);
    const stateConfig = pluginState?.config || {};
    const { url } = plugin;

    return (
      queue.add(() => (
        new Promise((resolve) => {
          window.gbpwRegisterPlugin = (PluginClass) => {
            window.gbpwRegisterPlugin = () => { /* noop */ };

            if (!PluginClass) {
              resolve(false);
              return;
            }

            try {
              const instance: PluginClassInstance = new PluginClass({
                saveAs,
                progress,
                store,
                collectImageData,
              }, stateConfig);

              const {
                name,
                description = '',
                configParams = {},
                config = {},
              } = instance;

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
            } catch (error: unknown) {
              store.dispatch({
                type: Actions.PLUGIN_UPDATE_PROPERTIES,
                payload: {
                  url,
                  loading: false,
                  error: (error as Error)?.message,
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
