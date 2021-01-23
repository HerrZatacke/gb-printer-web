import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state, { page }) => {
  const indexOffset = page * state.pageSize;
  const images = getFilteredImages(state, false).splice(indexOffset, state.pageSize || Infinity);
  const hasSelected = !!images.find(({ hash }) => state.imageSelection.includes(hash));

  return ({
    enabled: state.imageSelection.length > 1,
    activeFilters: state.filter.activeTags.length || 0,
    selectedImages: state.imageSelection.length,
    hasSelected,
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
  showSortOptions: () => {
    dispatch({
      type: 'SHOW_SORT_OPTIONS',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
