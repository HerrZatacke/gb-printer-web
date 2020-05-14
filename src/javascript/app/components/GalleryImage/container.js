import { connect } from 'react-redux';

const mapStateToProps = (state, { palette }) => ({
  palette: state.palettes.find(({ shortName }) => shortName === palette).palette,
});

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
      payload: ownProps,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
