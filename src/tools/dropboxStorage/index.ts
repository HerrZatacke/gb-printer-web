import { SyncDirection } from '@/consts/sync';
import type { UseStores } from '@/hooks/useStores';
import useStoragesStore from '@/stores/storagesStore';
import type { JSONExportState } from '@/types/ExportState';
import type { DropBoxSettings } from '@/types/Sync';

export interface DropBoxSyncTool {
  updateSettings: (dropBoxSettings: DropBoxSettings) => Promise<void>,
  startSyncData: (direction: SyncDirection) => Promise<void>,
  startSyncImages: () => Promise<void>,
  startAuth: () => Promise<void>,
  recoverImageData: (hash: string) => Promise<void>,
}

let dropBoxSyncTool: DropBoxSyncTool;

interface AndSubscribe {
  subscribe: () => () => void,
}

export const dropboxStorageTool = (
  stores: UseStores,
  remoteImport: (repoContents: JSONExportState) => Promise<void>,
): DropBoxSyncTool & AndSubscribe => {
  const loadAndInitMiddleware = async (): Promise<DropBoxSyncTool> => {
    if (!dropBoxSyncTool) {
      const { dropBoxSyncTool: tool } = await import(/* webpackChunkName: "syn" */ './main');
      dropBoxSyncTool = dropBoxSyncTool || tool(stores, remoteImport);
    }

    return dropBoxSyncTool;
  };

  if (useStoragesStore.getState().dropboxStorage.use) {
    loadAndInitMiddleware();
  }

  const subscribe = () => useStoragesStore.subscribe((state) => state.dropboxStorage, async (dropboxSettings) => {
    (await loadAndInitMiddleware()).updateSettings(dropboxSettings);
  });

  return {
    recoverImageData: async (hash: string) => (
      (await loadAndInitMiddleware()).recoverImageData(hash)
    ),
    startAuth: async () => (
      (await loadAndInitMiddleware()).startAuth()
    ),
    startSyncData: async (direction: SyncDirection) => (
      (await loadAndInitMiddleware()).startSyncData(direction)
    ),
    startSyncImages: async () => (
      (await loadAndInitMiddleware()).startSyncImages()
    ),
    updateSettings: async (dropBoxSettings: DropBoxSettings) => (
      (await loadAndInitMiddleware()).updateSettings(dropBoxSettings)
    ),
    subscribe,
  };
};
