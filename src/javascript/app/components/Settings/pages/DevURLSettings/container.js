import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  socketUrl: state.socketUrl,
  printerUrl: state.printerUrl,
});

const mapDispatchToProps = (dispatch) => ({
  updateSocketUrl(socketUrl) {
    dispatch({
      type: 'SET_SOCKET_URL',
      payload: socketUrl,
    });
  },
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: 'SET_PRINTER_URL',
      payload: printerUrl,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
