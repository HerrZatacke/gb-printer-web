import { ImageQueryParamsSchema, type ImageQueryParams } from 'gb-printer-schemas';
import { useMemo } from 'react';
import { useFiltersStore, useSettingsStore } from '@/stores/stores';


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
    return ImageQueryParamsSchema.parse({
      page,
      pageSize,
      filters: {
        tags: filtersTags,
        palette: filtersPalettes,
        frame: filtersFrames,
      },
      sort: {
        field: sortField,
        direction: direction,
      },
    });
  }, [filtersFrames, filtersPalettes, filtersTags, page, pageSize, sortBy]);

  return imageQueryParams;
};
