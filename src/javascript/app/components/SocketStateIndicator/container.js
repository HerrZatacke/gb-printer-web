import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  socketState: state.socketState,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
