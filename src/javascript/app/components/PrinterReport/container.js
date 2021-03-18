import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  printerData: state.printerData,
  printerFunctions: state.printerFunctions,
  printerConnected: state.printerFunctions.length > 0,
  printerBusy: state.printerBusy,
});

const mapDispatchToProps = (dispatch) => ({
  callRemoteFunction: (name) => {
    dispatch({
      type: 'REMOTE_CALL_FUNCTION',
      payload: name,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
