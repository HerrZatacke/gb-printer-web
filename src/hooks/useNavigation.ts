import WebUSBSerial from '../tools/WebUSBSerial';
import WebSerial from '../tools/WebSerial';
import type { SyncLastUpdate } from '../../types/Sync';
import useInteractionsStore from '../app/stores/interactionsStore';
import useSettingsStore from '../app/stores/settingsStore';
import useStoragesStore from '../app/stores/storagesStore';

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
  const { gitStorage, dropboxStorage } = useStoragesStore();

  const autoDropboxSync = dropboxStorage.autoDropboxSync || false;
  const useSync = !!(
    dropboxStorage.use ||
    (
      gitStorage.use &&
      gitStorage.owner &&
      gitStorage.repo &&
      gitStorage.branch &&
      gitStorage.throttle &&
      gitStorage.token
    )
  );

  const { syncBusy, setSyncSelect, setShowSerials } = useInteractionsStore();
  const { useSerials } = useSettingsStore();
  const { syncLastUpdate } = useStoragesStore();
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
