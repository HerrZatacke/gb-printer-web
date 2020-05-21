import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  imageCount: state.images.length,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
