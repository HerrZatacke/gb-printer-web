import { connect } from 'react-redux';
import { HIDE_SORT_OPTIONS, SET_SORT_BY } from '../../../store/actions';

const mapStateToProps = (state) => {
  const [sortBy = '', sortOrder = ''] = state.sortBy.split('_');
  return {
    visible: state.sortOptionsVisible,
    sortBy,
    sortOrder,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setSortBy: (sortBy) => {
    dispatch({
      type: SET_SORT_BY,
      payload: sortBy,
    });
  },
  hideSortForm: () => {
    dispatch({
      type: HIDE_SORT_OPTIONS,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
