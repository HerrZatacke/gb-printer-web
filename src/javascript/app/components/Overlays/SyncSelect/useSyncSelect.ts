import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import type { State } from '../../../store/State';
import type { SyncLastUpdate } from '../../../../../types/Sync';
import type { StorageSyncCancelAction, StorageSyncStartAction } from '../../../../../types/actions/LogActions';


interface UseSyncSelect {
  repoUrl: string,
  dropboxActive: boolean,
  gitActive: boolean,
  syncLastUpdate: SyncLastUpdate,
  autoDropboxSync: boolean,
  startSync: (storageType: string, direction: string) => void,
  cancelSync: () => void,
}

export const useSyncSelect = (): UseSyncSelect => {
  const data = useSelector((state: State) => ({
    repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
    dropboxActive: !!(
      state.dropboxStorage.use &&
      state.dropboxStorage.accessToken
    ),
    gitActive: !!(
      state.gitStorage.use &&
      state.gitStorage.owner &&
      state.gitStorage.repo &&
      state.gitStorage.branch &&
      state.gitStorage.throttle &&
      state.gitStorage.token
    ),
    syncLastUpdate: state.syncLastUpdate,
    autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
  }));

  const dispatch = useDispatch();

  return {
    ...data,
    startSync: (storageType: string, direction: string) => {
      dispatch<StorageSyncStartAction>({
        type: Actions.STORAGE_SYNC_START,
        payload: {
          storageType,
          direction,
        },
      });
    },
    cancelSync: () => {
      dispatch<StorageSyncCancelAction>({
        type: Actions.STORAGE_SYNC_CANCEL,
      });
    },
  };
};
