import useStoragesStore from '../../app/stores/storagesStore';
import type { GitStorageSettings } from '../../../types/Sync';
import type { JSONExportState } from '../../../types/ExportState';

export interface GitSyncTool {
  startSyncData: (direction: 'up' | 'down') => Promise<void>,
  updateSettings: (gitSettings: GitStorageSettings) => Promise<void >,
}


let gitSyncTool: GitSyncTool;

export const gitStorageTool = (
  remoteImport: (repoContents: JSONExportState) => Promise<void>,
): GitSyncTool => {
  const loadAndInitMiddleware = async (): Promise<GitSyncTool> => {
    if (!gitSyncTool) {
      const { init, gitSyncTool: tool } = await import(/* webpackChunkName: "syn" */ './main');
      init();
      gitSyncTool = gitSyncTool || tool(remoteImport);
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

