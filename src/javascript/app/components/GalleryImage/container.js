import { connect } from 'react-redux';
import getRGBNFrames from '../../../tools/getRGBNFrames';

const mapStateToProps = (state, { hash }) => {
  const image = state.images.find((img) => img.hash === hash);
  let palette;
  let frames;

  if (image.hashes) {
    palette = image.palette;
    frames = getRGBNFrames(state, image.hashes, image.frame);
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === image.palette);
    frames = null;
  }

  return ({
    title: image.title,
    created: image.created,
    index: image.index,
    frame: image.frame,
    hashes: image.hashes,
    tags: image.tags,
    isSelected: state.imageSelection.includes(hash),
    palette,
    frames,
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
