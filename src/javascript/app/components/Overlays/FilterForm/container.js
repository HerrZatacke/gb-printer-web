import { connect } from 'react-redux';
import unique from '../../../../tools/unique';
import { FILTER_FAVOURITE } from '../../../../consts/specialTags';

const mapStateToProps = (state) => ({
  availableTags: unique(state.images.map(({ tags }) => tags).flat())
    .filter((tag) => tag !== FILTER_FAVOURITE)
    .sort((a, b) => (
      a.toLowerCase().localeCompare(b.toLowerCase())
    )),
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
