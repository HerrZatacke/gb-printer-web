import { connect } from 'react-redux';
import { load } from '../../../tools/storage';

const mapStateToProps = (state, { hash, palette }) => ({
  tiles: load(hash),
  palette: state.palettes.find(({ shortName }) => shortName === palette).palette,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
