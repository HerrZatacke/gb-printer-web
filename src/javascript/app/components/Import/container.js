import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  printerUrl: state.printerUrl ? `${state.printerUrl}remote.html` : null,
  printerConnected: state.printerFunctions.length > 0,
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
  exportJson(what) {
    dispatch({
      type: 'JSON_EXPORT',
      payload: what,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
