import { connect } from 'react-redux';
import { Actions } from '../../store/actions';

const mapStateToProps = (state, { hash }) => ({
  isSelected: state.imageSelection.includes(hash),
  canShare: state.canShare,
  hasPlugins: !!state.plugins.length,
  hash,
});

const mapDispatchToProps = (dispatch, { hash, buttons, title }) => ({
  startDownload: buttons.includes('download') ? () => {
    dispatch({
      type: Actions.START_DOWNLOAD,
      payload: hash,
    });
  } : null,
  deleteImage: buttons.includes('delete') ? () => {
    dispatch({
      type: Actions.CONFIRM_ASK,
      payload: {
        message: title ? `Delete image "${title}"?` : 'Delete this image?',
        confirm: () => {
          dispatch({
            type: Actions.DELETE_IMAGE,
            payload: hash,
          });
        },
        deny: () => {
          dispatch({
            type: Actions.CONFIRM_ANSWERED,
          });
        },
      },
    });

  } : null,
  shareImage: buttons.includes('share') ? () => {
    dispatch({
      type: Actions.SHARE_IMAGE,
      payload: hash,
    });
  } : null,
  saveRGBNImage: buttons.includes('saveRGBNImage') ? () => {
    dispatch({
      type: Actions.SAVE_RGBN_IMAGE,
      payload: hash,
    });
  } : null,
  updateImageToSelection: buttons.includes('select') ? (mode) => {
    if (mode === 'add') {
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
  } : null,
  setLightboxImage: buttons.includes('view') ? () => {
    dispatch({
      type: Actions.SET_LIGHTBOX_IMAGE_HASH,
      payload: hash,
    });
  } : null,
  updateFavouriteTag: buttons.includes('favourite') ? (isFavourite) => {
    dispatch({
      type: Actions.IMAGE_FAVOURITE_TAG,
      payload: {
        hash,
        isFavourite,
      },
    });
  } : null,
});

export default connect(mapStateToProps, mapDispatchToProps);
