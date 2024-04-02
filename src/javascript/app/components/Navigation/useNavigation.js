import { useSelector, useDispatch } from 'react-redux';
import WebUSBSerial from '../../../tools/WebUSBSerial';
import WebSerial from '../../../tools/WebSerial';
import { Actions } from '../../store/actions';

const useNavigation = () => {
  const {
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
  } = useSelector((state) => ({
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
    dispatch({
      type: Actions.STORAGE_SYNC_SELECT,
    });
  };

  const setShowSerials = () => {
    dispatch({
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
