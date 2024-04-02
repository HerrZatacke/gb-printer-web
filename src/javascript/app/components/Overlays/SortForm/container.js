import { connect } from 'react-redux';
import { Actions } from '../../../store/actions';

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
      type: Actions.SET_SORT_BY,
      payload: sortBy,
    });
  },
  hideSortForm: () => {
    dispatch({
      type: Actions.HIDE_SORT_OPTIONS,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
