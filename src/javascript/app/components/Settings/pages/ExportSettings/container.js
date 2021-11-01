import { connect } from 'react-redux';
import { JSON_EXPORT } from '../../../../store/actions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  exportJson(what) {
    dispatch({
      type: JSON_EXPORT,
      payload: what,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
