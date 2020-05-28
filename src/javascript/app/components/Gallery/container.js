import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state) => {
  const indexOffset = state.currentPage * state.pageSize;
  const images = getFilteredImages(state).splice(indexOffset, state.pageSize);

  return ({
    images,
    indexOffset,
    currentView: state.galleryView,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
