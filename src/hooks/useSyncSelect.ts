import { StorageType, SyncDirection } from '@/consts/sync';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import { useInteractionsStore, useStoragesStore } from '@/stores/stores';
import { dropboxStorageTool } from '@/tools/dropboxStorage';
import { gitStorageTool } from '@/tools/gitStorage';
import type { SyncLastUpdate } from '@/types/Sync';

interface UseSyncSelect {
  repoUrl: string,
  dropboxActive: boolean,
  gitActive: boolean,
  syncLastUpdate: SyncLastUpdate,
  autoDropboxSync: boolean,
  startSync: (storageType: StorageType, direction: SyncDirection) => void,
  cancelSync: () => void,
}

export const useSyncSelect = (): UseSyncSelect => {
  const stores = useStores();
  const { remoteImport } = useImportExportSettings();

  const { setSyncSelect } = useInteractionsStore();
  const { gitStorage, dropboxStorage, syncLastUpdate } = useStoragesStore();

  return {
    repoUrl: `https://github.com/${gitStorage.owner}/${gitStorage.repo}/tree/${gitStorage.branch}`,
    dropboxActive: !!(
      dropboxStorage.use &&
      dropboxStorage.accessToken
    ),
    gitActive: !!(
      gitStorage.use &&
      gitStorage.owner &&
      gitStorage.repo &&
      gitStorage.branch &&
      gitStorage.throttle &&
      gitStorage.token
    ),
    autoDropboxSync: dropboxStorage.autoDropboxSync || false,
    syncLastUpdate,
    startSync: (storageType: StorageType, direction: SyncDirection) => {
      switch (storageType) {
        case StorageType.DROPBOX:
          dropboxStorageTool(stores, remoteImport).startSyncData(direction);
          break;

          case StorageType.DROPBOXIMAGES:
          dropboxStorageTool(stores, remoteImport).startSyncImages();
          break;

        case StorageType.GIT:
          gitStorageTool(remoteImport).startSyncData(direction);
          break;

        default:
          break;
      }
    },
    cancelSync: () => setSyncSelect(false),
  };
};
