import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  use: !!state.dropboxStorage.use,
  loggedIn: !!state.dropboxStorage.accessToken,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch({
      type: 'DROPBOX_LOGOUT',
    });
  },
  setDropboxStorage(dropboxStorage) {
    dispatch({
      type: 'SET_DROPBOX_STORAGE',
      payload: dropboxStorage,
    });
  },
  startAuth: (direction) => {
    dispatch({
      type: 'DROPBOX_START_AUTH',
      payload: direction,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
