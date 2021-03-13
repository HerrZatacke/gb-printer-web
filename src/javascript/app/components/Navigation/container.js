import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  importQueueSize: state.importQueueSize,
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
  repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
});

const mapDispatchToProps = (dispatch) => ({
  startSync: (storageType, direction) => {
    dispatch({
      type: 'STORAGE_SYNC_START',
      payload: {
        storageType,
        direction,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
