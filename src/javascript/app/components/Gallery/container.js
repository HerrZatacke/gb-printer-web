import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state) => {
  const indexOffset = state.currentPage * state.pageSize;
  return ({
    images: state.pageSize ? getFilteredImages(state).splice(indexOffset, state.pageSize) : state.images,
    indexOffset,
    currentView: state.galleryView,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
