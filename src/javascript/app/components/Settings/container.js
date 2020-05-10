import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  socketUrl: state.socketUrl,
});

const mapDispatchToProps = (dispatch) => ({
  updateSocketUrl(socketUrl) {
    dispatch({
      type: 'SET_SOCKET_URL',
      payload: socketUrl,
    });
  },
  startMock() {
    dispatch({
      type: 'START_MOCK',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
