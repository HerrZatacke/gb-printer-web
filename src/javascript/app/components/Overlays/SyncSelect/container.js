import { connect } from 'react-redux';
import { Actions } from '../../../store/actions';

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
  syncLastUpdate: state.syncLastUpdate,
  autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
});

const mapDispatchToProps = (dispatch) => ({
  startSync: (storageType, direction) => {
    dispatch({
      type: Actions.STORAGE_SYNC_START,
      payload: {
        storageType,
        direction,
      },
    });
  },
  cancelSync: (storageType, direction) => {
    dispatch({
      type: Actions.STORAGE_SYNC_CANCEL,
      payload: {
        storageType,
        direction,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
