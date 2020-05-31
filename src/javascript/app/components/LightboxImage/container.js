import { connect } from 'react-redux';

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
    frames = {
      r: image.frame || state.images.find((img) => img.hash === image.hashes.r).frame,
      g: image.frame || state.images.find((img) => img.hash === image.hashes.g).frame,
      b: image.frame || state.images.find((img) => img.hash === image.hashes.b).frame,
      n: image.frame || state.images.find((img) => img.hash === image.hashes.n).frame,
    };
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
