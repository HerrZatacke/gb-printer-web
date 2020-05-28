import { connect } from 'react-redux';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  batchDelete: (action) => {
    dispatch({
      type: 'BATCH_TASK',
      payload: action,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
