import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const indexOffset = state.currentPage * state.pageSize;
  return ({
    // images: state.images,
    images: state.pageSize ? [...state.images].splice(indexOffset, state.pageSize) : state.images,
    indexOffset,
    currentView: state.galleryView,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
