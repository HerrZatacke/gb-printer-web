import { useSelector } from 'react-redux';
import WebUSBSerial from '../../../tools/WebUSBSerial';
import WebSerial from '../../../tools/WebSerial';
import type { State } from '../../store/State';
import type { SyncLastUpdate } from '../../../../types/Sync';
import useInteractionsStore from '../../stores/interactionsStore';
import useSettingsStore from '../../stores/settingsStore';

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
    useSync,
    syncLastUpdate,
    autoDropboxSync,
  } = useSelector((state: State) => ({
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
    syncLastUpdate: state.syncLastUpdate,
    autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
  }));

  const { syncBusy, setSyncSelect, setShowSerials } = useInteractionsStore();
  const { useSerials } = useSettingsStore();
  const disableSerials = !WebUSBSerial.enabled && !WebSerial.enabled;

  return {
    disableSerials,
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
    selectSync: () => setSyncSelect(true),
    setShowSerials: () => setShowSerials(true),
  };
};

export default useNavigation;
