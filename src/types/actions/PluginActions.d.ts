import type { Actions } from '../../javascript/app/store/actions';
import type { Plugin } from '../Plugin';

export interface PluginRemoveAction {
  type: Actions.PLUGIN_REMOVE,
  payload?: string,
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

export interface PluginImageSingleAction {
  type: Actions.PLUGIN_IMAGE,
  payload: {
    url: string,
    hash: string,
  },
}

export interface PluginImageBatchAction {
  type: Actions.PLUGIN_IMAGES,
  payload: {
    url: string,
  },
}
