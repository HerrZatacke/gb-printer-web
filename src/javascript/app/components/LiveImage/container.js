import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  tiles: state.lineBuffer,
  palette: state.palettes.find(({ shortName }) => shortName === state.activePalette).palette,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
