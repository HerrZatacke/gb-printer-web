import { connect } from 'react-redux';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  exportJson(what) {
    dispatch({
      type: 'JSON_EXPORT',
      payload: what,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
