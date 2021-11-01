import { connect } from 'react-redux';
import {
  CONFIRM_ANSWERED,
  CONFIRM_ASK,
  DELETE_IMAGE,
  IMAGE_FAVOURITE_TAG,
  IMAGE_SELECTION_ADD,
  IMAGE_SELECTION_REMOVE,
  SAVE_RGBN_IMAGE,
  SET_LIGHTBOX_IMAGE_HASH,
  SHARE_IMAGE,
  START_DOWNLOAD,
} from '../../store/actions';

const mapStateToProps = (state, { hash }) => ({
  isSelected: state.imageSelection.includes(hash),
  canShare: state.canShare,
  hasPlugins: !!state.plugins.length,
  hash,
});

const mapDispatchToProps = (dispatch, { hash, buttons, title }) => ({
  startDownload: buttons.includes('download') ? () => {
    dispatch({
      type: START_DOWNLOAD,
      payload: hash,
    });
  } : null,
  deleteImage: buttons.includes('delete') ? () => {
    dispatch({
      type: CONFIRM_ASK,
      payload: {
        message: title ? `Delete image "${title}"?` : 'Delete this image?',
        confirm: () => {
          dispatch({
            type: DELETE_IMAGE,
            payload: hash,
          });
        },
        deny: () => {
          dispatch({
            type: CONFIRM_ANSWERED,
          });
        },
      },
    });

  } : null,
  shareImage: buttons.includes('share') ? () => {
    dispatch({
      type: SHARE_IMAGE,
      payload: hash,
    });
  } : null,
  saveRGBNImage: buttons.includes('saveRGBNImage') ? () => {
    dispatch({
      type: SAVE_RGBN_IMAGE,
      payload: hash,
    });
  } : null,
  updateImageToSelection: buttons.includes('select') ? (mode) => {
    if (mode === 'add') {
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
  } : null,
  setLightboxImage: buttons.includes('view') ? () => {
    dispatch({
      type: SET_LIGHTBOX_IMAGE_HASH,
      payload: hash,
    });
  } : null,
  updateFavouriteTag: buttons.includes('favourite') ? (isFavourite) => {
    dispatch({
      type: IMAGE_FAVOURITE_TAG,
      payload: {
        hash,
        isFavourite,
      },
    });
  } : null,
});

export default connect(mapStateToProps, mapDispatchToProps);
