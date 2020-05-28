import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  enabled: state.imageSelection.length > 0,
});

const mapDispatchToProps = (dispatch) => ({
  batchDelete: (action) => {
    dispatch({
      type: 'BATCH_TASK',
      payload: action,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
