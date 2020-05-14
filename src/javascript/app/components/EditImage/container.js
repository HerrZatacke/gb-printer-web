import { connect } from 'react-redux';
import { load } from '../../../tools/storage';

const mapStateToProps = (state) => ({
  title: state.editImage.title || '',
  imageData: state.editImage.hash ? load(state.editImage.hash) || null : null,
  palette: state.editImage.palette ? state.palettes.find(({ shortName }) => (
    shortName === state.editImage.palette
  )) || {} : {},
});

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
});

export default connect(mapStateToProps, mapDispatchToProps);
