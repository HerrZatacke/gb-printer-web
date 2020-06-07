import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  imageCount: state.images.length,
  pageSize: state.pageSize,
  selectedCount: state.imageSelection.length,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
