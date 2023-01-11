import { useDispatch, useSelector } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';
import { BATCH_TASK, SHOW_FILTERS, SHOW_SORT_OPTIONS } from '../../store/actions';

const useBatchButtons = (page) => {
  const state = useSelector((currentState) => currentState);
  const dispatch = useDispatch();

  const indexOffset = page * state.pageSize;
  const images = getFilteredImages(state).splice(indexOffset, state.pageSize || Infinity);
  const hasSelected = !!images.find(({ hash }) => state.imageSelection.includes(hash));

  return ({
    hasPlugins: !!state.plugins.length,
    batchEnabled: state.imageSelection.length > 1,
    activeFilters: state.filtersActiveTags.length || 0,
    selectedImages: state.imageSelection.length,
    hasSelected,
    batchTask: (action) => {
      dispatch({
        type: BATCH_TASK,
        payload: action,
        page,
      });
    },
    filter: () => {
      dispatch({
        type: SHOW_FILTERS,
      });
    },
    showSortOptions: () => {
      dispatch({
        type: SHOW_SORT_OPTIONS,
      });
    },
  });
};

export default useBatchButtons;
