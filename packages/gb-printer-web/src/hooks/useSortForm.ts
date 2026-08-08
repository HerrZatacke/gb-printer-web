import { type SortDirection } from 'gb-printer-schemas';
import { useFiltersStore } from '@/stores/stores';

interface UseSortForm {
  visible: boolean;
  sortBy: string;
  sortOrder: SortDirection;
  setSortBy: (sortBy: string) => void;
  hideSortForm: () => void;
}

export const useSortForm = (): UseSortForm => {
  const { setSortBy, setSortOptionsVisible, sortOptionsVisible, sortBy: stateSortBy } = useFiltersStore();

  const [sortBy = '', sortOrder = ''] = stateSortBy.split('_');

  return {
    visible: sortOptionsVisible,
    sortBy,
    sortOrder: sortOrder as SortDirection,
    setSortBy,
    hideSortForm: () => setSortOptionsVisible(false),
  };
};
