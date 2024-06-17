import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../../store/State';
import { Plugin } from '../../../../../../types/Plugin';
import { Actions } from '../../../../store/actions';
import {
  PluginAddAction,
  PluginRemoveAction,
  PluginUpdateConfigAction,
} from '../../../../../../types/actions/PluginActions';

interface UsePlugins {
  plugins: Plugin[];
  pluginAdd: (url: string) => void,
  pluginRemove: (url: string) => void,
  pluginUpdateConfig: (url: string, key: string, value: string | number) => void,
}

export const usePlugins = (): UsePlugins => {
  const plugins: Plugin[] = useSelector((state: State) => state.plugins);
  const dispatch = useDispatch();

  const pluginAdd = (url: string) => {
    dispatch<PluginAddAction>({
      type: Actions.PLUGIN_ADD,
      payload: url,
    });
  };

  const pluginRemove = (url: string) => {
    dispatch<PluginRemoveAction>({
      type: Actions.PLUGIN_REMOVE,
      payload: url,
    });
  };

  const pluginUpdateConfig = (url: string, key: string, value: string | number) => {
    dispatch<PluginUpdateConfigAction>({
      type: Actions.PLUGIN_UPDATE_CONFIG,
      payload: {
        url,
        config: {
          [key]: value,
        },
      },
    });
  };

  return {
    plugins,
    pluginAdd,
    pluginRemove,
    pluginUpdateConfig,
  };
};
