import Queue from 'promise-queue';
import { saveAs } from 'file-saver';
import type { RGBNTiles, RGBNPalette, ExportFrameMode } from 'gb-image-decoder';
import { RGBNDecoder, Decoder, BW_PALETTE_HEX } from 'gb-image-decoder';
import useSettingsStore from '../../stores/settingsStore';
import useFiltersStore from '../../stores/filtersStore';
import { loadImageTiles } from '../../../tools/loadImageTiles';
import { getImagePalettes } from '../../../tools/getImagePalettes';
import { Actions } from '../actions';
import { getRotatedCanvas } from '../../../tools/applyRotation';
import { isRGBNImage } from '../../../tools/isRGBNImage';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { Palette } from '../../../../types/Palette';
import type { Plugin, PluginArgs, PluginClassInstance, PluginConfigValues, PluginImageData } from '../../../../types/Plugin';
import type { TypedStore } from '../State';
import type { PluginUpdatePropertiesAction } from '../../../../types/actions/PluginActions';
import type { MonochromeImage } from '../../../../types/Image';
import { loadFrameData } from '../../../tools/applyFrame/frameData';
import { getDecoderUpdateParams } from '../../../tools/getDecoderUpdateParams';
import useInteractionsStore from '../../stores/interactionsStore';

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

export interface GetCanvasOptions {
  scaleFactor?: number,
  palette?: Palette | RGBNPalette,
  framePalette?: Palette,
  lockFrame?: boolean,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  handleExportFrame?: ExportFrameMode,
}

const pluginsMiddleware: MiddlewareWithState = (store) => {
  const registeredPlugins: RegisteredPlugins = {};
  const queue = new Queue(1, Infinity);
  const { setProgress } = useInteractionsStore.getState();

  const progress = (progressValue: number): void => {
    setProgress('plugin', progressValue % 1);
  };

  const collectImageData = (hash: string): PluginImageData => {
    const state = store.getState();
    const { handleExportFrame: handleExportFrameState } = useSettingsStore.getState();

    const meta = state.images.find((image) => image.hash === hash);
    if (!meta) {
      throw new Error('image not found');
    }

    const { palette: selectedPalette, framePalette: selectedFramePalette } = getImagePalettes(state, meta);
    if (!selectedPalette) {
      throw new Error('selectedPalette not found');
    }

    const getTiles = () => loadImageTiles(state)(meta.hash);

    const isRGBN = isRGBNImage(meta);

    const getCanvas = async (options: GetCanvasOptions = {}): Promise<HTMLCanvasElement> => {
      const {
        scaleFactor = 1,
        palette = selectedPalette,
        framePalette = selectedFramePalette,
        lockFrame = meta.lockFrame || false,
        invertPalette = (meta as MonochromeImage).invertPalette || false,
        invertFramePalette = (meta as MonochromeImage).invertFramePalette || false,
        handleExportFrame = handleExportFrameState,
      } = options;

      const tiles = await getTiles();
      let decoder: RGBNDecoder | Decoder;

      const frame = state.frames.find(({ id }) => id === meta.frame);
      const frameData = frame ? await loadFrameData(frame.hash) : null;
      const imageStartLine = frameData ? frameData.upper.length / 20 : 2;

      if (isRGBN) {
        decoder = new RGBNDecoder();
        decoder.update({
          canvas: null,
          tiles: tiles as RGBNTiles,
          palette: palette as RGBNPalette,
          lockFrame,
        });
      } else {
        decoder = new Decoder();
        const pal = (palette as Palette)?.palette || BW_PALETTE_HEX;
        const framePal = (framePalette as Palette)?.palette || BW_PALETTE_HEX;

        const updateParams = getDecoderUpdateParams({
          palette: pal,
          framePalette: framePal,
          invertPalette,
          invertFramePalette,
        });

        decoder.update({
          canvas: null,
          tiles: tiles as string[],
          ...updateParams,
          imageStartLine,
        });
      }

      const canvas = getRotatedCanvas(decoder.getScaledCanvas(scaleFactor, handleExportFrame), meta.rotation || 0);

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

              store.dispatch<PluginUpdatePropertiesAction>({
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
              store.dispatch<PluginUpdatePropertiesAction>({
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

            store.dispatch<PluginUpdatePropertiesAction>({
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
        const { imageSelection } = useFiltersStore.getState();
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
