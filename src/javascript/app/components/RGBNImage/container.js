import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  tilesR: state.rgbnImages.r,
  tilesG: state.rgbnImages.g,
  tilesB: state.rgbnImages.b,
  tilesN: state.rgbnImages.n,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
