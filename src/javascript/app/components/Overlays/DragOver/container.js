import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  dragover: state.dragover,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
