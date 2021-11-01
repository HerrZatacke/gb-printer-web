import { connect } from 'react-redux';
import { SET_CURRENT_GALLERY_VIEW } from '../../store/actions';

const mapStateToProps = (state) => ({
  currentView: state.galleryView,
});

const mapDispatchToProps = (dispatch) => ({
  updateView: (view) => {
    dispatch({
      type: SET_CURRENT_GALLERY_VIEW,
      payload: view,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
