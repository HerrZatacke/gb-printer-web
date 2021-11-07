import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  frames: state.frames,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
