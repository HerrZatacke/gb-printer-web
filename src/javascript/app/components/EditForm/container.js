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

  const height = (state.windowDimensions.width <= 480) ?
    state.windowDimensions.height :
    Math.min(800, state.windowDimensions.height);

  return ({
    batch: state.editImage.batch,
    created: state.editImage.created || null,
    hash: state.editImage.hash,
    tags: state.editImage.tags,
    title: state.editImage.title,
    hashes: state.editImage.hashes,
    frame: state.editImage.frame,
    lockFrame: state.editImage.lockFrame || false,
    palette,
    invertPalette: state.editImage.invertPalette || false,
    frames,
    height,
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
  updateCreated: (created) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { created, confirmed: true },
    });
  },
  updateInvertPalette: (invertPalette) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { invertPalette, confirmed: true },
    });
  },
  updateFrame: (frame) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { frame, confirmed: true },
    });
  },
  updateFrameLock: (lockFrame) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { lockFrame, confirmed: true },
    });
  },
  updateTags: (mode, tag) => {
    dispatch({
      type: 'UPDATE_EDIT_IMAGE',
      payload: { tag, mode, confirmed: true },
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
