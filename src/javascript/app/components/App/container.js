import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  imageCount: state.images.length,
  selectedCount: state.imageSelection.length,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(mapStateToProps, mapDispatchToProps);
