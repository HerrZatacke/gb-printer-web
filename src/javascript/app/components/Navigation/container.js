import { connect } from 'react-redux';

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
});

const mapDispatchToProps = (dispatch) => ({
  selectSync: () => {
    dispatch({
      type: 'STORAGE_SYNC_SELECT',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
