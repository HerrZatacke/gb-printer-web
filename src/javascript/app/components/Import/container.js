import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  dumpCount: state.printerData.dumps ? state.printerData.dumps.length : 0,
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
});

export default connect(mapStateToProps, mapDispatchToProps);
