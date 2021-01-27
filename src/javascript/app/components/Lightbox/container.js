import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  isFullscreen: state.isFullscreen,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
