import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const mapStateToProps = (state, { page }) => {
  const indexOffset = page * state.pageSize;
  const images = getFilteredImages(state).splice(indexOffset, state.pageSize || Infinity);

  return ({
    images,
    currentView: state.galleryView,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
