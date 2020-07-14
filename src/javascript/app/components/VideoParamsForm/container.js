import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  imageCount: state.videoParams.imageSelection ? state.videoParams.imageSelection.length : 0,
  scaleFactor: state.videoParams.scaleFactor || null,
  frameRate: state.videoParams.frameRate || null,
});

const mapDispatchToProps = (dispatch) => ({
  cancel: () => {
    dispatch({
      type: 'CANCEL_ANIMATE_IMAGES',
    });
  },
  animate: () => {
    dispatch({
      type: 'ANIMATE_IMAGES',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
