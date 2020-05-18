import { connect } from 'react-redux';

const mapStateToProps = (state, { palette }) => ({
  palette: state.palettes.find(({ shortName }) => shortName === palette).palette,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
