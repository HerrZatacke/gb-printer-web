import type { Actions } from '../../javascript/app/store/actions';

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
