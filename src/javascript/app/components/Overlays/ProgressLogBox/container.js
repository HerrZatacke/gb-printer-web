import { connect } from 'react-redux';
import { LOG_CLEAR } from '../../../store/actions';

const mapStateToProps = (state) => ({
  git: {
    messages: state.progressLog.git || [],
    repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
    repo: state.gitStorage.repo,
    branch: state.gitStorage.branch,
  },
  dropbox: {
    messages: state.progressLog.dropbox || [],
    path: state.dropboxStorage.path || '',
  },
});

const mapDispatchToProps = (dispatch) => ({
  confirm: () => {
    dispatch({
      type: LOG_CLEAR,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
