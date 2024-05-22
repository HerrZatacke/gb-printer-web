import { connect } from 'react-redux';
import { missingGreyPalette } from '../../defaults';
import { SpecialTags } from '../../../consts/SpecialTags';
import { Actions } from '../../store/actions';

const mapStateToProps = (state, { hash }) => {
  const image = state.images.find((img) => img.hash === hash);
  let palette;

  if (!image) {
    return {};
  }

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
    isFavourite: image.tags.includes(SpecialTags.FILTER_FAVOURITE),
    isSelected: state.imageSelection.includes(hash),
    palette,
    lockFrame: image.lockFrame || false,
    invertPalette: image.invertPalette || false,
    hideDate: state.hideDates,
    preferredLocale: state.preferredLocale,
    meta: image.meta || null,
    rotation: image.rotation || null,
    enableDebug: state.enableDebug,
  });
};

const mapDispatchToProps = (dispatch, { hash }) => ({
  updateImageSelection: (mode, shift, page) => {
    if (shift) {
      dispatch({
        type: Actions.IMAGE_SELECTION_SHIFTCLICK,
        payload: hash,
        page,
      });
    } else if (mode === 'add') {
      dispatch({
        type: Actions.IMAGE_SELECTION_ADD,
        payload: hash,
      });
    } else {
      dispatch({
        type: Actions.IMAGE_SELECTION_REMOVE,
        payload: hash,
      });
    }
  },
  editImage: (tags) => {
    dispatch({
      type: Actions.EDIT_IMAGE_SELECTION,
      payload: {
        tags,
        batch: [hash],
      },
    }); // as EditImageSelectionAction
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
