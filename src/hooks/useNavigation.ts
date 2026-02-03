import { usePortsContext } from '@/contexts/ports';
import {
  useInteractionsStore,
  useSettingsStore,
  useStoragesStore,
} from '@/stores/stores';
import type { SyncLastUpdate } from '@/types/Sync';

interface UseNavigation {
  disableSerials: boolean,
  serialWarning: boolean,
  portCount: number,
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
  const {
    webUSBEnabled,
    webSerialEnabled,
    hasInactiveDevices,
    unknownDeviceResponse,
    connectedDevices,
  } = usePortsContext();

  return {
    disableSerials: !webUSBEnabled && !webSerialEnabled,
    serialWarning: Boolean(hasInactiveDevices && unknownDeviceResponse),
    portCount: connectedDevices.length,
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
