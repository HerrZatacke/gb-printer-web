import { useEffect, useState } from 'react';
import useFiltersStore from '../../../stores/filtersStore';
import { useAvailableTags } from '../../../../hooks/useAvailableTags';
import unique from '../../../../tools/unique';

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
  applyClearTags: () => void,
  cancel: () => void,
  confirm: () => void,
}

export const useFilterForm = (): UseFilterForm => {
  const {
    filtersActiveTags: stateActiveTags,
    filtersVisible: visible,
    setFiltersVisible,
    setFiltersActiveTags,
  } = useFiltersStore();

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
    applyClearTags: () => setFiltersActiveTags([]),
    confirm: () => setFiltersActiveTags(activeTags),
    cancel: () => setFiltersVisible(false),
  };
};
