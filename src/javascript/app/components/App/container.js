import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state) => ({
  imageCount: state.images.length,
  pageSize: state.pageSize,
  selectedCount: state.imageSelection.length,
  filteredCount: getFilteredImages(state, false).length,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
