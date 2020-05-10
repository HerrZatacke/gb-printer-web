import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  tiles: state.lineBuffer,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
