import { useSelector, useDispatch } from 'react-redux';
import WebUSBSerial from '../../../tools/WebUSBSerial';
import WebSerial from '../../../tools/WebSerial';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { SyncLastUpdate } from '../../../../types/Sync';
import { StorageSyncSelectAction } from '../../../../types/actions/LogActions';
import { ShowSerialsAction } from '../../../../types/actions/GlobalActions';

interface UseNavigation {
  disableSerials: boolean,
  syncBusy: boolean,
  useSync: boolean,
  useSerials: boolean,
  syncLastUpdate: SyncLastUpdate,
  autoDropboxSync: boolean,
  selectSync: () => void,
  setShowSerials: () => void,
}

const useNavigation = (): UseNavigation => {
  const {
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
  } = useSelector((state: State) => ({
    syncBusy: state.syncBusy,
    useSync: !!(
      state.dropboxStorage.use ||
      (
        state.gitStorage.use &&
        state.gitStorage.owner &&
        state.gitStorage.repo &&
        state.gitStorage.branch &&
        state.gitStorage.throttle &&
        state.gitStorage.token
      )
    ),
    useSerials: state.useSerials,
    syncLastUpdate: state.syncLastUpdate,
    autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
  }));

  const dispatch = useDispatch();

  const disableSerials = !WebUSBSerial.enabled && !WebSerial.enabled;

  const selectSync = () => {
    dispatch<StorageSyncSelectAction>({
      type: Actions.STORAGE_SYNC_SELECT,
    });
  };

  const setShowSerials = () => {
    dispatch<ShowSerialsAction>({
      type: Actions.SHOW_SERIALS,
      payload: true,
    });
  };

  return {
    disableSerials,
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
    selectSync,
    setShowSerials,
  };
};

export default useNavigation;
