import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  dumpCount: state.printerData.dumps ? state.printerData.dumps.length : 0,
});

const mapDispatchToProps = (dispatch) => ({
  importPlainText: (textDump) => {
    dispatch({
      type: 'IMPORT_PLAIN_TEXT',
      payload: textDump,
    });
  },
  importFile: (file) => {
    dispatch({
      type: 'IMPORT_FILE',
      payload: file,
    });
  },
  checkPrinter: () => {
    dispatch({
      type: 'PRINTER_QUERY',
    });
  },
  downloadPrinter: () => {
    dispatch({
      type: 'PRINTER_DOWNLOAD',
    });
  },
  clearPrinter: () => {
    dispatch({
      type: 'PRINTER_CLEAR',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
