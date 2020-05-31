import { connect } from 'react-redux';
import getRGBNFrames from '../../../tools/getRGBNFrames';

const mapStateToProps = (state) => {
  if (!state.editImage) {
    return {};
  }

  let palette;
  let frames;

  if (state.editImage.hashes) {
    palette = state.editImage.palette;
    frames = getRGBNFrames(state, state.editImage.hashes, state.editImage.frame);
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === state.editImage.palette);
    frames = null;
  }

  return ({
    hash: state.editImage.hash,
    title: state.editImage.title,
    hashes: state.editImage.hashes,
    frame: state.editImage.frame,
    palette,
    frames,
  });
};

const mapDispatchToProps = (dispatch) => ({
  updateTitle: (title) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { title },
    });
  },
  updatePalette: (palette) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { palette },
    });
  },
  save: () => {
    dispatch({
      type: 'SAVE_EDIT_IMAGE',
    });
  },
  cancel: () => {
    dispatch({
      type: 'CANCEL_EDIT_IMAGE',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
