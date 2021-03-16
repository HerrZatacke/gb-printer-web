import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  dumpCount: state.printerData.dumps ? state.printerData.dumps.length : 0,
  printerUrl: state.printerUrl ? `${state.printerUrl}#simple` : null,
  printerConnected: state.printerHeartbeat,
});

const mapDispatchToProps = (dispatch) => ({
  importPlainText: (textDump) => {
    let file;
    try {
      file = new File([...textDump], 'Text input.txt', { type: 'text/plain' });
    } catch (error) {
      file = new Blob([...textDump], { type: 'text/plain' });
    }

    dispatch({
      type: 'IMPORT_FILE',
      payload: { files: [file] },
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
  exportJson(what) {
    dispatch({
      type: 'JSON_EXPORT',
      payload: what,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
