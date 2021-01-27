import { connect } from 'react-redux';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';

const mapStateToProps = (state) => ({
  imageCount: state.images.length,
  pageSize: state.pageSize,
  selectedCount: state.imageSelection.length,
  filteredCount: getFilteredImagesCount(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
