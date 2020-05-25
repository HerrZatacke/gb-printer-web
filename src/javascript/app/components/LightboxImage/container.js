import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const image = state.images.find((_, index) => index === state.lightboxImage);
  let palette;

  if (!image) {
    return {};
  }

  if (image.hashes) {
    palette = image.palette;
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === image.palette);
  }

  return ({
    hash: image.hash,
    title: image.title,
    created: image.created,
    hashes: image.hashes,
    palette,
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
