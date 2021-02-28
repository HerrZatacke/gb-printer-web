import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  gitStorage: state.gitStorage,
});

const mapDispatchToProps = (dispatch) => ({
  setGitStorage(gitStorage) {
    dispatch({
      type: 'SET_GIT_STORAGE',
      payload: gitStorage,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
