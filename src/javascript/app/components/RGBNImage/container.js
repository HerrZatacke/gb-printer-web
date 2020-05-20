import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  tilesR: state.rgbnImages.r,
  tilesG: state.rgbnImages.g,
  tilesB: state.rgbnImages.b,
  tilesN: state.rgbnImages.n,
});

const mapDispatchToProps = (dispatch) => ({
  startDownload: () => {
    dispatch({
      type: 'START_DOWNLOAD_RGBN',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
