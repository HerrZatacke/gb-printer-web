import { connect } from 'react-redux';

const mapStateToProps = (state, { palette }) => ({
  palette: (state.palettes.find(({ shortName }) => shortName === palette) || state.palettes[0]).palette,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
