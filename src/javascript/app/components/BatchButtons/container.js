import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state, { page }) => {
  const indexOffset = page * state.pageSize;
  const images = getFilteredImages(state).splice(indexOffset, state.pageSize || Infinity);
  const hasUnselected = !!images.find(({ hash }) => !state.imageSelection.includes(hash));

  return ({
    enabled: state.imageSelection.length > 1,
    hasUnselected,
  });
};

const mapDispatchToProps = (dispatch) => ({
  batchTask: (action, page) => {
    dispatch({
      type: 'BATCH_TASK',
      payload: action,
      page,
    });
  },
  filter: () => {
    dispatch({
      type: 'SHOW_FILTERS',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
