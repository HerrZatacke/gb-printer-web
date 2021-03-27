import { connect } from 'react-redux';
import { missingGreyPalette } from '../../defaults';

const mapStateToProps = (state, { hash }) => {
  const image = state.images.find((img) => img.hash === hash);
  let palette;

  if (image.hashes) {
    palette = image.palette;
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === image.palette) || missingGreyPalette;
  }

  return ({
    title: image.title,
    created: image.created,
    frame: image.frame,
    hashes: image.hashes,
    tags: image.tags,
    isSelected: state.imageSelection.includes(hash),
    palette,
    lockFrame: image.lockFrame || false,
    invertPalette: image.invertPalette || false,
    hideDate: state.hideDates,
  });
};

const mapDispatchToProps = (dispatch, { hash }) => ({
  updateImageSelection: (mode, shift, page) => {
    if (shift) {
      dispatch({
        type: 'IMAGE_SELECTION_SHIFTCLICK',
        payload: hash,
        page,
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
  editImage: () => {
    dispatch({
      type: 'EDIT_IMAGE',
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
