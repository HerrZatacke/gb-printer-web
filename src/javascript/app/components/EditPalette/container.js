import { connect } from 'react-redux';
import getPreviewImages from '../../../tools/getPreviewImages';

const mapStateToProps = (state) => ({
  shortName: state.editPalette.shortName,
  palette: state.editPalette.palette || [],
  name: state.editPalette.name || '',
  getPreviewImages: getPreviewImages(state),
  shortNameIsValid: (shortName) => {
    if (!shortName.match(/^[a-z]+[a-z0-9]*$/gi)) {
      return false;
    }

    return state.palettes.findIndex((palette) => palette.shortName === shortName) === -1;
  },
});

const mapDispatchToProps = (dispatch) => ({
  savePalette: (palette) => {
    dispatch({
      type: 'PALETTE_UPDATE',
      payload: palette,
    });
  },
  cancelEditPalette: () => {
    dispatch({
      type: 'PALETTE_CANCEL_EDIT',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
