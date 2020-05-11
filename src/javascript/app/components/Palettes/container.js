import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  palettes: state.palettes,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
