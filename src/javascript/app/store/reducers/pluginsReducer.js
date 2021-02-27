const pluginsReducer = (plugins = [], action) => {
  switch (action.type) {
    case 'PLUGIN_REMOVE':
      return [...plugins.filter(({ url }) => url !== action.payload)];
    case 'PLUGIN_ADD':
      return [...plugins, action.payload];
    default:
      return plugins;
  }
};

export default pluginsReducer;
