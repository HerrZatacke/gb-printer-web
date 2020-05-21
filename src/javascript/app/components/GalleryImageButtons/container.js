import { connect } from 'react-redux';

const mapStateToProps = () => ({});

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
  saveRGBNImage: buttons.includes('saveRGBNImage') ? () => {
    dispatch({
      type: 'SAVE_IMAGE',
      payload: hash,
    });
  } : null,
});

export default connect(mapStateToProps, mapDispatchToProps);
