import { connect } from 'react-redux';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  startDownload: () => {
    dispatch({
      type: 'START_DOWNLOAD',
      payload: ownProps.hash,
    });
  },
  deleteImage: () => {
    dispatch({
      type: 'DELETE_IMAGE',
      payload: ownProps.hash,
    });
  },
  editImage: () => {
    dispatch({
      type: 'EDIT_IMAGE',
      payload: ownProps.hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
