/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';
import sortBy from '../../../tools/sortby';
import type { Plugin } from '../../../../types/Plugin';
import type {
  PluginAddAction,
  PluginRemoveAction,
  PluginUpdateConfigAction,
  PluginUpdatePropertiesAction,
} from '../../../../types/actions/PluginActions';
import type { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';

const uniqueByUrl = uniqueBy<Plugin>('url');
const sortByUrl = sortBy<Plugin>('url');

const pluginsReducer = (
  plugins: Plugin[] = [],
  action:
    PluginAddAction |
    PluginUpdatePropertiesAction |
    PluginUpdateConfigAction |
    PluginRemoveAction |
    GlobalUpdateAction,
): Plugin[] => {
  switch (action.type) {
    case Actions.PLUGIN_REMOVE:
      return sortByUrl(uniqueByUrl([...plugins.filter(({ url }) => url !== action.payload)]));
    case Actions.PLUGIN_ADD:
      return sortByUrl(uniqueByUrl([
        {
          url: action.payload,
        },
        ...plugins,
      ]));
    case Actions.PLUGIN_UPDATE_PROPERTIES:
      return sortByUrl(uniqueByUrl(plugins.map((plugin) => {
        if (plugin.url !== action.payload.url) {
          return plugin;
        }

        return {
          ...plugin,
          ...action.payload,
        };
      })));
    case Actions.PLUGIN_UPDATE_CONFIG:
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
    case Actions.GLOBAL_UPDATE:
      return uniqueBy<Plugin>('url')([...(action.payload?.plugins || []), ...plugins]);
    default:
      return plugins;
  }
};

export default pluginsReducer;
