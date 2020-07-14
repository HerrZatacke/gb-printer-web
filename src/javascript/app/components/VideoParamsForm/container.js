import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  imageCount: state.videoParams.imageSelection ? state.videoParams.imageSelection.length : 0,
  scaleFactor: state.videoParams.scaleFactor || null,
  frameRate: state.videoParams.frameRate || 1,
  yoyo: state.videoParams.yoyo || false,
});

const mapDispatchToProps = (dispatch) => ({
  update: (changedValue) => {
    dispatch({
      type: 'SET_VIDEO_PARAMS',
      payload: changedValue,
    });
  },
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
