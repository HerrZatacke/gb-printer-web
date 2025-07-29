import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import useInteractionsStore from '@/stores/interactionsStore';
import useStoragesStore from '@/stores/storagesStore';
import { dropboxStorageTool } from '@/tools/dropboxStorage';
import { gitStorageTool } from '@/tools/gitStorage';
import type { SyncLastUpdate } from '@/types/Sync';


interface UseSyncSelect {
  repoUrl: string,
  dropboxActive: boolean,
  gitActive: boolean,
  syncLastUpdate: SyncLastUpdate,
  autoDropboxSync: boolean,
  startSync: (storageType: 'git' | 'dropbox' | 'dropboximages', direction: 'up' | 'down') => void,
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
    startSync: (storageType: 'git' | 'dropbox' | 'dropboximages', direction: 'up' | 'down') => {
      if (storageType === 'dropbox') {
        dropboxStorageTool(stores, remoteImport).startSyncData(direction);
      } else if (storageType === 'dropboximages') {
        dropboxStorageTool(stores, remoteImport).startSyncImages();
      } else {
        gitStorageTool(remoteImport).startSyncData(direction);
      }
    },
    cancelSync: () => setSyncSelect(false),
  };
};
