import { useDispatch, useSelector } from 'react-redux';
import getFilteredImages from '../../../tools/getFilteredImages';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { BatchTaskAction } from '../../../../types/actions/ImageActions';
import type { BatchActionType } from '../../../consts/batchActionTypes';
import type { ShowFiltersAction } from '../../../../types/actions/TagsActions';
import type { SortOptionsSetAction } from '../../../../types/actions/SortOptionsActions';

const useBatchButtons = (page: number) => {
  const state = useSelector((currentState: State) => currentState);
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
    batchTask: (action: BatchActionType) => {
      dispatch<BatchTaskAction>({
        type: Actions.BATCH_TASK,
        payload: action,
        page,
      });
    },
    filter: () => {
      dispatch<ShowFiltersAction>({
        type: Actions.SHOW_FILTERS,
      });
    },
    showSortOptions: () => {
      dispatch<SortOptionsSetAction>({
        type: Actions.SHOW_SORT_OPTIONS,
      });
    },
  });
};

export default useBatchButtons;
