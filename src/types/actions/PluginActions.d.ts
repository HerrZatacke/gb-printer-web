import { Actions } from '../../javascript/app/store/actions';
import { Plugin } from '../Plugin';

export interface PluginRemoveAction {
  type: Actions.PLUGIN_REMOVE,
  payload: string,
}

export interface PluginAddAction {
  type: Actions.PLUGIN_ADD,
  payload: string,
}

export interface PluginUpdatePropertiesAction {
  type: Actions.PLUGIN_UPDATE_PROPERTIES,
  payload: Plugin,
}

export interface PluginUpdateConfigAction {
  type: Actions.PLUGIN_UPDATE_CONFIG,
  payload: Plugin,
}
