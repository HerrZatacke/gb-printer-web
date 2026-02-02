import { SyncDirection } from '@/consts/sync';
import { useStoragesStore } from '@/stores/stores';
import type { JSONExportState } from '@/types/ExportState';
import type { GitStorageSettings } from '@/types/Sync';

export interface GitSyncTool {
  startSyncData: (direction: SyncDirection) => Promise<void>,
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
    startSyncData: async (direction: SyncDirection) => (
      (await loadAndInitMiddleware()).startSyncData(direction)
    ),
    updateSettings: async (gitSettings: GitStorageSettings) => (
      (await loadAndInitMiddleware()).updateSettings(gitSettings)
    ),
  };
};

