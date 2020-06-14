import { connect } from 'react-redux';

const mapStateToProps = (/* state */) => ({
});

const mapDispatchToProps = (dispatch) => ({
  dumpPlainText: (textDump) => {
    dispatch({
      type: 'IMPORT_PLAIN_TEXT',
      payload: textDump,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
