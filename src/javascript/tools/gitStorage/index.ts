import useStoragesStore from '../../app/stores/storagesStore';
import type { SyncTool } from './main';
import type { TypedStore } from '../../app/store/State';
import type { GitStorageSettings } from '../../../types/Sync';

let gitSyncTool: SyncTool;

export const gitStorageTool = (store: TypedStore): SyncTool => {
  const loadAndInitMiddleware = async (): Promise<SyncTool> => {
    if (!gitSyncTool) {
      const { init, gitSyncTool: tool } = await import(/* webpackChunkName: "gmw" */ './main');
      init();
      gitSyncTool = gitSyncTool || tool(store);
    }

    return gitSyncTool;
  };

  const enabled = (): boolean => {
    const { gitStorage: {
      use,
      owner,
      repo,
      branch,
      token,
    } } = useStoragesStore.getState();

    return !!(use && owner && repo && branch && token);
  };

  if (enabled()) {
    loadAndInitMiddleware();
  }

  return {
    startSyncData: async (direction: 'up' | 'down') => (
      (await loadAndInitMiddleware()).startSyncData(direction)
    ),
    updateSettings: async (gitSettings: GitStorageSettings) => (
      (await loadAndInitMiddleware()).updateSettings(gitSettings)
    ),
  };
};

