import { connect } from 'react-redux';
import { Actions } from '../../../../store/actions';

const mapStateToProps = (state) => ({
  use: !!state.dropboxStorage.use,
  loggedIn: !!state.dropboxStorage.refreshToken,
  path: state.dropboxStorage.path || '',
  autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch({
      type: Actions.DROPBOX_LOGOUT,
    });
  },
  setDropboxStorage(dropboxStorage) {
    dispatch({
      type: Actions.SET_DROPBOX_STORAGE,
      payload: dropboxStorage,
    });
  },
  startAuth: (direction) => {
    dispatch({
      type: Actions.DROPBOX_START_AUTH,
      payload: direction,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
