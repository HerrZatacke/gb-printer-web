import { useSelector } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';

const usePageImages = (page) => {
  const state = useSelector((currentState) => currentState);
  const indexOffset = page * state.pageSize;
  const images = getFilteredImages(state).splice(indexOffset, state.pageSize || Infinity);

  return ({
    images,
    currentView: state.galleryView,
  });
};

export default usePageImages;
