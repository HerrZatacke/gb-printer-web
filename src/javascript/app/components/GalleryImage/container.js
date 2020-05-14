import { connect } from 'react-redux';

const mapStateToProps = (state, { palette }) => ({
  palette: state.palettes.find(({ shortName }) => shortName === palette).palette,
});

const mapDispatchToProps = (dispatch, { hash }) => ({
  startDownload: () => {
    dispatch({
      type: 'START_DOWNLOAD',
      payload: hash,
    });
  },
  deleteImage: () => {
    dispatch({
      type: 'DELETE_IMAGE',
      payload: hash,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
