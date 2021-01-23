import { connect } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';
import sortImages from '../../../tools/sortImages';

const mapStateToProps = (state, { page }) => {
  const indexOffset = page * state.pageSize;
  const images = getFilteredImages(state)
    .sort(sortImages(state))
    .splice(indexOffset, state.pageSize || Infinity);

  return ({
    images,
    currentView: state.galleryView,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
