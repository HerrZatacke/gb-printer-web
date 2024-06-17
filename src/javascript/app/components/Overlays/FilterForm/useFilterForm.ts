import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableTags } from '../../../../hooks/useAvailableTags';
import unique from '../../../../tools/unique';
import { State } from '../../../store/State';
import { Actions } from '../../../store/actions';
import { HideFiltersAction, SetActiveTagsAction } from '../../../../../types/actions/TagsActions';

export enum ActiveTagUpdateMode {
  ADD = 'add',
  REMOVE = 'remove',
}

interface UseFilterForm {
  visible: boolean,
  availableTags: string[],
  activeTags: string[],
  updateActiveTags: (tag: string, mode: ActiveTagUpdateMode) => void,
  clearTags: () => void,
  cancel: () => void,
  confirm: () => void,
}

export const useFilterForm = (): UseFilterForm => {
  const { activeTags: stateActiveTags, visible } = useSelector((state: State) => ({
    activeTags: state.filtersActiveTags,
    visible: state.filtersVisible,
  }));

  const dispatch = useDispatch();

  const [activeTags, setActiveTags] = useState(stateActiveTags);

  const { availableTags } = useAvailableTags();

  useEffect(() => {
    setActiveTags(stateActiveTags);
  }, [stateActiveTags]);

  const updateActiveTags = (tag: string, mode: ActiveTagUpdateMode) => {
    setActiveTags(mode === 'add' ? unique([...activeTags, tag]) : activeTags.filter((t) => t !== tag));
  };

  return {
    visible,
    availableTags,
    activeTags,
    updateActiveTags,
    clearTags: () => setActiveTags([]),
    confirm: () => {
      dispatch<SetActiveTagsAction>({
        type: Actions.SET_ACTIVE_TAGS,
        payload: activeTags,
      });
    },
    cancel: () => {
      dispatch<HideFiltersAction>({
        type: Actions.HIDE_FILTERS,
      });
    },
  };
};
