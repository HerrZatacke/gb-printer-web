import { getItemsSource } from '@/stores/items/client';
import { globalKeys } from '@/stores/queries/cacheKeys';
import { STALE_TIME } from '@/stores/queries/consts';

export const globalStatsQueryOptions = () => {
  return {
    queryKey: globalKeys.stats,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getStats();
    },
    staleTime: STALE_TIME,
  };
};
