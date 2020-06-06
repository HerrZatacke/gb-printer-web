import { connect } from 'react-redux';
import getRGBNFrames from '../../../tools/getRGBNFrames';

const mapStateToProps = (state) => {
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
    batch: state.editImage.batch,
    hash: state.editImage.hash,
    tags: state.editImage.tags || [],
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
      payload: { title, confirmed: true },
    });
  },
  updatePalette: (palette, confirmed) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { palette, confirmed },
    });
  },
  updateFrame: (frame) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { frame, confirmed: true },
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
