import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  importQueueSize: state.importQueueSize,
  gitStatus: state.gitStatus,
  useGit: !!(
    state.gitStorage.use &&
    state.gitStorage.owner &&
    state.gitStorage.repo &&
    state.gitStorage.branch &&
    state.gitStorage.token
  ),
});

const mapDispatchToProps = (dispatch) => ({
  startSync: (direction) => {
    dispatch({
      type: 'GITSTORAGE_SYNC_START',
      payload: direction,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
