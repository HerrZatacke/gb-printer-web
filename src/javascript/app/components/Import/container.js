import { connect } from 'react-redux';

const mapStateToProps = (/* state */) => ({
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
});

export default connect(mapStateToProps, mapDispatchToProps);
