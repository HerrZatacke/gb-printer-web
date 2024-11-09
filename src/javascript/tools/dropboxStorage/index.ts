import useStoragesStore from '../../app/stores/storagesStore';
import type { TypedStore } from '../../app/store/State';
import type { SyncTool } from './main';
import type { DropBoxSettings } from '../../../types/Sync';

let dropBoxSyncTool: SyncTool;

export const dropboxStorageTool = (store: TypedStore): SyncTool => {

  const loadAndInitMiddleware = async (): Promise<SyncTool> => {
    if (!dropBoxSyncTool) {
      const { dropBoxSyncTool: tool } = await import(/* webpackChunkName: "dmw" */ './main');
      dropBoxSyncTool = dropBoxSyncTool || tool(store);
    }

    return dropBoxSyncTool;
  };

  if (useStoragesStore.getState().dropboxStorage.use) {
    loadAndInitMiddleware();
  }

  useStoragesStore.subscribe((state) => state.dropboxStorage, async (dropboxSettings) => {
    (await loadAndInitMiddleware()).updateSettings(dropboxSettings);
  });

  return {
    recoverImageData: async (hash: string) => (
      (await loadAndInitMiddleware()).recoverImageData(hash)
    ),
    startAuth: async () => (
      (await loadAndInitMiddleware()).startAuth()
    ),
    startSyncData: async (direction: 'up' | 'down' | 'diff') => (
      (await loadAndInitMiddleware()).startSyncData(direction)
    ),
    startSyncImages: async () => (
      (await loadAndInitMiddleware()).startSyncImages()
    ),
    updateSettings: async (dropBoxSettings: DropBoxSettings) => (
      (await loadAndInitMiddleware()).updateSettings(dropBoxSettings)
    ),
  };
};
