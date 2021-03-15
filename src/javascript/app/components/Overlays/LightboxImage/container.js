import { connect } from 'react-redux';
import getRGBNFrames from '../../../../tools/getRGBNFrames';
import getFilteredImages from '../../../../tools/getFilteredImages';

const mapStateToProps = (state) => {
  const images = getFilteredImages(state);
  const image = images.find((_, lightboxIndex) => lightboxIndex === state.lightboxImage);
  let palette;
  let frames;

  if (!image) {
    return {
      isFullscreen: false,
      lockFrame: false,
      invertPalette: false,
      lightboxIndex: 0,
      size: 0,
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
    lightboxIndex: state.lightboxImage,
    size: images.length || 0,
    lockFrame: image.lockFrame || false,
    invertPalette: image.invertPalette || false,
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
