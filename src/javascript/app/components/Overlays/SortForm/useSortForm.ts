import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import { State } from '../../../store/State';
import { SortOptionsHideAction, SortOptionsSetSortByAction } from '../../../../../types/actions/SortOptionsActions';
import { SortDirection } from '../../../../tools/sortby';

interface UseSortForm {
  visible: boolean,
  sortBy: string,
  sortOrder: SortDirection,
  setSortBy: (sortBy: string) => void,
  hideSortForm: () => void,
}

export const useSortForm = (): UseSortForm => {
  const data = useSelector((state: State) => {
    const [sortBy = '', sortOrder = ''] = state.sortBy.split('_');
    return {
      visible: state.sortOptionsVisible,
      sortBy,
      sortOrder: sortOrder as SortDirection,
    };
  });

  const dispatch = useDispatch();

  return {
    ...data,
    setSortBy: (sortBy: string) => {
      dispatch({
        type: Actions.SET_SORT_BY,
        payload: sortBy,
      } as SortOptionsSetSortByAction);
    },
    hideSortForm: () => {
      dispatch({
        type: Actions.HIDE_SORT_OPTIONS,
      } as SortOptionsHideAction);
    },
  };
};
