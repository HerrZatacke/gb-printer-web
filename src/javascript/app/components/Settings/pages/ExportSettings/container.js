import { connect } from 'react-redux';
import { Actions } from '../../../../store/actions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  exportJson(what) {
    dispatch({
      type: Actions.JSON_EXPORT,
      payload: what,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
