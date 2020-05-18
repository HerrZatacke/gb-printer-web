import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  currentView: state.galleryView,
});

const mapDispatchToProps = (dispatch) => ({
  updateView: (view) => {
    dispatch({
      type: 'SET_CURRENT_GALLERY_VIEW',
      payload: view,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
