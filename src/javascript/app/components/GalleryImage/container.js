import { connect } from 'react-redux';

const mapStateToProps = (state, { hash }) => {
  const image = state.images.find((img) => img.hash === hash);
  let palette;

  if (image.hashes) {
    palette = image.palette;
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === image.palette);
  }

  return ({
    title: image.title,
    created: image.created,
    index: image.index,
    hashes: image.hashes,
    isSelected: state.imageSelection.includes(hash),
    palette,
  });
};

const mapDispatchToProps = (dispatch, { index, hash }) => ({
  setLightboxImageIndex: () => {
    dispatch({
      type: 'SET_LIGHTBOX_IMAGE_INDEX',
      payload: index,
    });
  },
  updateImageSelection: (mode, shift) => {
    if (shift) {
      dispatch({
        type: 'IMAGE_SELECTION_SHIFTCLICK',
        payload: hash,
      });
    } else if (mode === 'add') {
      dispatch({
        type: 'IMAGE_SELECTION_ADD',
        payload: hash,
      });
    } else {
      dispatch({
        type: 'IMAGE_SELECTION_REMOVE',
        payload: hash,
      });
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
