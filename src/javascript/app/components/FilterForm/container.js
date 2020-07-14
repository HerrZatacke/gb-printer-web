import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  availableTags: state.filter.availableTags,
  activeTags: state.filter.activeTags,
  visible: state.filter.visible,
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
