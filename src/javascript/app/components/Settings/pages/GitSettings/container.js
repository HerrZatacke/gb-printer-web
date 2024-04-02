import { connect } from 'react-redux';
import { Actions } from '../../../../store/actions';

const mapStateToProps = (state) => ({
  gitStorage: state.gitStorage,
});

const mapDispatchToProps = (dispatch) => ({
  setGitStorage(gitStorage) {
    dispatch({
      type: Actions.SET_GIT_STORAGE,
      payload: gitStorage,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
