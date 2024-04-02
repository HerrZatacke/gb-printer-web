import { connect } from 'react-redux';
import { Actions } from '../../../store/actions';

const mapStateToProps = (state) => ({
  activeTags: state.filtersActiveTags,
  visible: state.filtersVisible,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTags: (activeTags) => {
    dispatch({
      type: Actions.SET_ACTIVE_TAGS,
      payload: activeTags,
    });
  },
  hideFilters: (activeTags) => {
    dispatch({
      type: Actions.HIDE_FILTERS,
      payload: activeTags,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
