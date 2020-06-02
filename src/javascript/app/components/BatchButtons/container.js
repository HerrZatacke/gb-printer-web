import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state) => {
  const indexOffset = state.currentPage * state.pageSize;
  const images = getFilteredImages(state).splice(indexOffset, state.pageSize || Infinity);
  const hasUnselected = !!images.find(({ hash }) => !state.imageSelection.includes(hash));

  return ({
    enabled: state.imageSelection.length > 0,
    hasUnselected,
  });
};

const mapDispatchToProps = (dispatch) => ({
  batchTask: (action) => {
    dispatch({
      type: 'BATCH_TASK',
      payload: action,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
