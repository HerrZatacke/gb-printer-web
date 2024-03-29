import uniqueBy from '../../../tools/unique/by';
import sortBy from '../../../tools/sortby';
import {
  PLUGIN_ADD,
  PLUGIN_REMOVE,
  PLUGIN_UPDATE_CONFIG,
  PLUGIN_UPDATE_PROPERTIES,
} from '../actions';

const uniqueByUrl = uniqueBy('url');
const sortByUrl = sortBy('url');

const pluginsReducer = (plugins = [], action) => {
  switch (action.type) {
    case PLUGIN_REMOVE:
      return sortByUrl(uniqueByUrl([...plugins.filter(({ url }) => url !== action.payload)]));
    case PLUGIN_ADD:
      return sortByUrl(uniqueByUrl([
        {
          url: action.payload,
        },
        ...plugins,
      ]));
    case PLUGIN_UPDATE_PROPERTIES:
      return sortByUrl(uniqueByUrl(plugins.map((plugin) => {
        if (plugin.url !== action.payload.url) {
          return plugin;
        }

        return {
          ...plugin,
          ...action.payload,
        };
      })));
    case PLUGIN_UPDATE_CONFIG:
      return sortByUrl(uniqueByUrl(plugins.map((plugin) => {
        if (plugin.url !== action.payload.url) {
          return plugin;
        }

        const config = {
          ...(plugin.config || {}),
          ...(action.payload.config || {}),
        };

        return {
          ...plugin,
          config,
        };
      })));
    default:
      return plugins;
  }
};

export default pluginsReducer;
