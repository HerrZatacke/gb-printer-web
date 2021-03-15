import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
  dropboxActive: !!(
    state.dropboxStorage.use &&
    state.dropboxStorage.accessToken
  ),
  gitActive: !!(
    state.gitStorage.use &&
    state.gitStorage.owner &&
    state.gitStorage.repo &&
    state.gitStorage.branch &&
    state.gitStorage.throttle &&
    state.gitStorage.token
  ),
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
  cancelSync: (storageType, direction) => {
    dispatch({
      type: 'STORAGE_SYNC_CANCEL',
      payload: {
        storageType,
        direction,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
