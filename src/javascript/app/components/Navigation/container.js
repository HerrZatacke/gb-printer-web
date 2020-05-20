import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  importQueueSize: state.importQueueSize,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
