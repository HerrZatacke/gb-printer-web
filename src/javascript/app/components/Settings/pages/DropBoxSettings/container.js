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
});

export default connect(mapStateToProps, mapDispatchToProps);
