const pluginsMiddleware = (store) => {
  const registeredPlugins = {};

  window.requestAnimationFrame(() => {
    const { plugins } = store.getState();

    plugins.forEach(({ url }) => {

      window.gbpwRegisterPlugin = (Plugin) => {
        try {
          const instance = new Plugin({ store });
          instance.init();
          const name = instance.name;
          registeredPlugins[url] = { instance, name };
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

  return (next) => (action) => {

    switch (action.type) {
      case 'PLUGIN_IMAGE':
      case 'PLUGIN_IMAGES':
      default:
        break;
    }

    next(action);
  };
};

export default pluginsMiddleware;
