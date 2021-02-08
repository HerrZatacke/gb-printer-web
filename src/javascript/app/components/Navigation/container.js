import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  importQueueSize: state.importQueueSize,
  gitBusy: state.gitBusy,
  useGit: !!(
    state.gitStorage.use &&
    state.gitStorage.owner &&
    state.gitStorage.repo &&
    state.gitStorage.branch &&
    state.gitStorage.throttle &&
    state.gitStorage.token
  ),
  repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
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
