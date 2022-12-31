import { connect } from 'react-redux';
import { missingGreyPalette } from '../../defaults';
import { FILTER_FAVOURITE } from '../../../consts/specialTags';
import {
  EDIT_IMAGE,
  IMAGE_SELECTION_ADD,
  IMAGE_SELECTION_REMOVE,
  IMAGE_SELECTION_SHIFTCLICK,
} from '../../store/actions';

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
    isFavourite: image.tags.includes(FILTER_FAVOURITE),
    isSelected: state.imageSelection.includes(hash),
    palette,
    lockFrame: image.lockFrame || false,
    invertPalette: image.invertPalette || false,
    hideDate: state.hideDates,
    preferredLocale: state.preferredLocale,
    meta: image.meta || null,
  });
};

const mapDispatchToProps = (dispatch, { hash }) => ({
  updateImageSelection: (mode, shift, page) => {
    if (shift) {
      dispatch({
        type: IMAGE_SELECTION_SHIFTCLICK,
        payload: hash,
        page,
      });
    } else if (mode === 'add') {
      dispatch({
        type: IMAGE_SELECTION_ADD,
        payload: hash,
      });
    } else {
      dispatch({
        type: IMAGE_SELECTION_REMOVE,
        payload: hash,
      });
    }
  },
  editImage: () => {
    dispatch({
      type: EDIT_IMAGE,
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
