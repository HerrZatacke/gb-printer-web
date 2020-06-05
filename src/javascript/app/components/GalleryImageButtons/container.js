import { connect } from 'react-redux';

const mapStateToProps = (state, { hash }) => ({
  isSelected: state.imageSelection.includes(hash),
});

const mapDispatchToProps = (dispatch, { hash, buttons }) => ({
  startDownload: buttons.includes('download') ? () => {
    dispatch({
      type: 'START_DOWNLOAD',
      payload: hash,
    });
  } : null,
  deleteImage: buttons.includes('delete') ? () => {
    dispatch({
      type: 'DELETE_IMAGE',
      payload: hash,
    });
  } : null,
  editImage: buttons.includes('edit') ? () => {
    dispatch({
      type: 'EDIT_IMAGE',
      payload: hash,
    });
  } : null,
  // shareImage: buttons.includes('share') ? () => {
  shareImage: (buttons.includes('share') && window.navigator.share) ? () => {
    dispatch({
      type: 'SHARE_IMAGE',
      payload: hash,
    });
  } : null,
  saveRGBNImage: buttons.includes('saveRGBNImage') ? () => {
    dispatch({
      type: 'SAVE_RGBN_IMAGE',
      payload: hash,
    });
  } : null,
  updateImageToSelection: buttons.includes('select') ? (mode) => {
    if (mode === 'add') {
      dispatch({
        type: 'IMAGE_SELECTION_ADD',
        payload: hash,
      });
    } else {
      dispatch({
        type: 'IMAGE_SELECTION_REMOVE',
        payload: hash,
      });
    }
  } : null,
});

export default connect(mapStateToProps, mapDispatchToProps);
