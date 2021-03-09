import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  dropboxToken: state.dropboxToken,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch({
      type: 'DROPBOX_LOGOUT',
    });
  },
  startSync: (direction) => {
    dispatch({
      type: 'DROPBOX_SYNC_START',
      payload: direction,
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
