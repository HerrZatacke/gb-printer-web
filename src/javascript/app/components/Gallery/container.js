import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  images: state.images,
  currentView: state.galleryView,
});

const mapDispatchToProps = (dispatch) => ({
  updateView: (view) => {
    console.log(view);
    dispatch({
      type: 'SET_CURRENT_GALLERY_VIEW',
      payload: view,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
