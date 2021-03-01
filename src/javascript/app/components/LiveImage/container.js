import { connect } from 'react-redux';
import { missingGreyPalette } from '../../defaults';

const mapStateToProps = (state) => ({
  tiles: state.lineBuffer,
  palette: state.palettes.find(({ shortName }) => shortName === state.activePalette) || missingGreyPalette,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
