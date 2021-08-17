import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  activeTags: state.filtersActiveTags,
  visible: state.filtersVisible,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTags: (activeTags) => {
    dispatch({
      type: 'SET_ACTIVE_TAGS',
      payload: activeTags,
    });
  },
  hideFilters: (activeTags) => {
    dispatch({
      type: 'HIDE_FILTERS',
      payload: activeTags,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
