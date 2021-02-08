import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  messages: state.gitLog,
  repoUrl: `https://github.com/${state.gitStorage.owner}/${state.gitStorage.repo}/tree/${state.gitStorage.branch}`,
  repo: state.gitStorage.repo,
  branch: state.gitStorage.branch,
});

const mapDispatchToProps = (dispatch) => ({
  confirm: () => {
    dispatch({
      type: 'GITSTORAGE_LOG_CLEAR',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
