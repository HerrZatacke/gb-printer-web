import uniqueBy from '../../../tools/unique/by';
import sortBy from '../../../tools/sortby';

const uniqueByUrl = uniqueBy('url');
const sortByUrl = sortBy('url');

const pluginsReducer = (plugins = [], action) => {
  switch (action.type) {
    case 'PLUGIN_REMOVE':
      return sortByUrl(uniqueByUrl([...plugins.filter(({ url }) => url !== action.payload)]));
    case 'PLUGIN_ADD':
      return sortByUrl(uniqueByUrl([
        {
          url: action.payload,
        },
        ...plugins,
      ]));
    case 'PLUGIN_UPDATE_PROPERTIES':
      return sortByUrl(uniqueByUrl(plugins.map((plugin) => {
        if (plugin.url !== action.payload.url) {
          return plugin;
        }

        return {
          ...plugin,
          ...action.payload,
        };
      })));
    default:
      return plugins;
  }
};

export default pluginsReducer;
