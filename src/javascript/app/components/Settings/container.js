import { connect } from 'react-redux';
import { SET_PRINTER_URL } from '../../store/actions';

const mapStateToProps = (state) => ({
  printerUrl: state.printerUrl,
});

const mapDispatchToProps = (dispatch) => ({
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: SET_PRINTER_URL,
      payload: printerUrl,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
