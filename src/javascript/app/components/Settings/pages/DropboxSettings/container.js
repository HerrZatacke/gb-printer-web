import { connect } from 'react-redux';
import { DROPBOX_LOGOUT, DROPBOX_START_AUTH, SET_DROPBOX_STORAGE } from '../../../../store/actions';

const mapStateToProps = (state) => ({
  use: !!state.dropboxStorage.use,
  loggedIn: !!state.dropboxStorage.refreshToken,
  path: state.dropboxStorage.path || '',
  autoDropboxSync: state.dropboxStorage?.autoDropboxSync || false,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch({
      type: DROPBOX_LOGOUT,
    });
  },
  setDropboxStorage(dropboxStorage) {
    dispatch({
      type: SET_DROPBOX_STORAGE,
      payload: dropboxStorage,
    });
  },
  startAuth: (direction) => {
    dispatch({
      type: DROPBOX_START_AUTH,
      payload: direction,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
