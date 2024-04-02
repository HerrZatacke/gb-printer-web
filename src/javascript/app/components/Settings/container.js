import { connect } from 'react-redux';
import { Actions } from '../../store/actions';

const mapStateToProps = (state) => ({
  printerUrl: state.printerUrl,
});

const mapDispatchToProps = (dispatch) => ({
  updatePrinterUrl(printerUrl) {
    dispatch({
      type: Actions.SET_PRINTER_URL,
      payload: printerUrl,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
