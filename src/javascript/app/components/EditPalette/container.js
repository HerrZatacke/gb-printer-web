import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const getPreviewImages = (state) => () => {
  const previewImages = [];

  if (state.imageSelection.length > 0) {
    previewImages.push(
      state.images.find(({ hash }) => hash === state.imageSelection[0]),
    );
  }

  if (state.imageSelection.length > 1) {
    previewImages.push(
      state.images.find(({ hash }) => hash === state.imageSelection[state.imageSelection.length - 1]),
    );
  }

  if (previewImages.filter(Boolean).length === 2) {
    return previewImages;
  }

  const filtered = getFilteredImages(state);

  previewImages.push(
    filtered[0],
  );

  if (previewImages.filter(Boolean).length === 2) {
    return previewImages;
  }

  return [
    ...previewImages,
    filtered[filtered.length - 1],
  ];
};

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
