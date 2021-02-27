import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';

const pluginsMiddleware = (store) => {
  const registeredPlugins = {};

  window.requestAnimationFrame(() => {
    const { plugins } = store.getState();

    plugins.forEach(({ url }) => {

      window.gbpwRegisterPlugin = (Plugin) => {
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
        } catch (error) {
          store.dispatch({
            type: 'ERROR',
            payload: `Cound not create instance of plugin at "${url}"\n${error.message}\n${error.stack}`,
          });
        }
      };

      // init loading of external script.
      const pluginScript = document.createElement('script');
      document.head.appendChild(pluginScript);
      pluginScript.src = url;
    });
  });

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

  return (next) => (action) => {

    switch (action.type) {
      case 'PLUGIN_IMAGE': {
        const { url, hash } = action.payload;
        registeredPlugins[url].withImage(collectImageData(hash));
        break;
      }

      case 'PLUGIN_IMAGES':
      default:
        break;
    }

    next(action);
  };
};

export default pluginsMiddleware;
