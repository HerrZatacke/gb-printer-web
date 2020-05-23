import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  if (!state.editImage) {
    return {};
  }

  let palette;

  if (state.editImage.hashes) {
    palette = state.editImage.palette;
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === state.editImage.palette);
  }

  return ({
    hash: state.editImage.hash,
    title: state.editImage.title,
    hashes: state.editImage.hashes,
    palette,
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
