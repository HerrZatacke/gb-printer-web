import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
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
