import { connect } from 'react-redux';
import WebUSBSerial from '../../../tools/WebUSBSerial';
import WebSerial from '../../../tools/WebSerial';

const mapStateToProps = (state) => ({
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
  disableSerials: !WebUSBSerial.enabled && !WebSerial.enabled,
  syncLastUpdate: state.syncLastUpdate,
});

const mapDispatchToProps = (dispatch) => ({
  selectSync: () => {
    dispatch({
      type: 'STORAGE_SYNC_SELECT',
    });
  },
  setShowSerials: () => {
    dispatch({
      type: 'SHOW_SERIALS',
      payload: true,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
