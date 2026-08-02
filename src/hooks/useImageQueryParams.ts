import { useMemo } from 'react';
import { useFiltersStore, useSettingsStore } from '@/stores/stores';
import  { type ImageQueryParams, type ImageSortField, type SortDirection } from '@/workers/itemsIndexedDbWorker/types';

export const useImageQueryParams = (page: number = 0): ImageQueryParams => {
  const {
    filtersTags,
    filtersPalettes,
    filtersFrames,
    sortBy,
  } = useFiltersStore();
  const { pageSize } = useSettingsStore();

  const imageQueryParams = useMemo<ImageQueryParams>(() => {
    const [sortField, direction] = sortBy.split('_');
    return {
      page,
      pageSize,
      filters: {
        tags: filtersTags,
        palette: filtersPalettes,
        frame: filtersFrames,
      },
      sort: {
        field: sortField as ImageSortField,
        direction: direction as SortDirection,
      },
    };
  }, [filtersFrames, filtersPalettes, filtersTags, page, pageSize, sortBy]);

  return imageQueryParams;
};
