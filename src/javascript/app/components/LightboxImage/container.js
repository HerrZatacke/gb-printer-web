import { connect } from 'react-redux';
import getRGBNFrames from '../../../tools/getRGBNFrames';

const mapStateToProps = (state) => {
  const image = state.images.find((_, index) => index === state.lightboxImage);
  let palette;
  let frames;

  if (!image) {
    return {
      isFullscreen: state.isFullscreen,
    };
  }

  if (image.hashes) {
    palette = image.palette;
    frames = getRGBNFrames(state, image.hashes, image.frame);
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === image.palette);
    frames = null;
  }

  return ({
    hash: image.hash,
    title: image.title,
    created: image.created,
    hashes: image.hashes,
    frame: image.frame,
    isFullscreen: state.isFullscreen,
    palette,
    frames,
  });
};

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch({
      type: 'SET_LIGHTBOX_IMAGE_INDEX',
      payload: null,
    });
  },
  prev: () => {
    dispatch({
      type: 'LIGHTBOX_PREV',
    });
  },
  next: () => {
    dispatch({
      type: 'LIGHTBOX_NEXT',
    });
  },
  fullscreen: () => {
    dispatch({
      type: 'LIGHTBOX_FULLSCREEN',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
