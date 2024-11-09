import { useDispatch, useStore } from 'react-redux';
import { Actions } from '../../../store/actions';
import type { TypedStore } from '../../../store/State';
import type { SyncLastUpdate } from '../../../../../types/Sync';
import type { StorageSyncStartAction } from '../../../../../types/actions/LogActions';
import useInteractionsStore from '../../../stores/interactionsStore';
import useSettingsStore from '../../../stores/settingsStore';
import { dropBoxSyncTool } from '../../../../tools/dropboxStorage/main';
import useStoragesStore from '../../../stores/storagesStore';


interface UseSyncSelect {
  repoUrl: string,
  dropboxActive: boolean,
  gitActive: boolean,
  syncLastUpdate: SyncLastUpdate,
  autoDropboxSync: boolean,
  startSync: (storageType: 'git' | 'dropbox' | 'dropboximages', direction: 'up' | 'down' | 'diff') => void,
  cancelSync: () => void,
}

export const useSyncSelect = (): UseSyncSelect => {
  const store: TypedStore = useStore();

  const { setSyncSelect } = useInteractionsStore();
  const { syncLastUpdate } = useSettingsStore();
  const { gitStorage, dropboxStorage } = useStoragesStore();

  const dispatch = useDispatch();

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
    startSync: (storageType: 'git' | 'dropbox' | 'dropboximages', direction: 'up' | 'down' | 'diff') => {
      if (storageType === 'dropbox') {
        dropBoxSyncTool(store).startSyncData(direction);
      } else if (storageType === 'dropboximages') {
        dropBoxSyncTool(store).startSyncImages();
      } else {
        dispatch<StorageSyncStartAction>({
          type: Actions.STORAGE_SYNC_START,
          payload: {
            storageType,
            direction,
          },
        });
      }
    },
    cancelSync: () => setSyncSelect(false),
  };
};
