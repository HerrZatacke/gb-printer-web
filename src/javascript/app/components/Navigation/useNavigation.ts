import { useSelector, useDispatch } from 'react-redux';
import WebUSBSerial from '../../../tools/WebUSBSerial';
import WebSerial from '../../../tools/WebSerial';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { SyncLastUpdate } from '../../../../types/Sync';
import type { ShowSerialsAction } from '../../../../types/actions/GlobalActions';
import useInteractionsStore from '../../stores/interactionsStore';

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
    useSerials,
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
    useSerials: state.useSerials,
    syncLastUpdate: state.syncLastUpdate,
    autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
  }));

  const { syncBusy, setSyncSelect } = useInteractionsStore();

  const dispatch = useDispatch();

  const disableSerials = !WebUSBSerial.enabled && !WebSerial.enabled;

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
    selectSync: () => setSyncSelect(true),
    setShowSerials,
  };
};

export default useNavigation;
