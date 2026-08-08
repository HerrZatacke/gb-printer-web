import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ItemsStatsTotals, type ItemsUsageTotals } from 'gb-printer-schemas';
import { globalStatsQueryOptions, globalUsagesQueryOptions } from '@/stores/items/queries/global';

export interface UseGlobalQueries {
  stats: ItemsStatsTotals | null;
  isLoadingStats: boolean;
  usages: ItemsUsageTotals | null;
  isLoadingUsages: boolean;
}

export interface UseGlobalQueriesOptions {
  stats?: boolean;
  usages?: boolean;
}

export const useGlobalQueries = ({ stats, usages }: UseGlobalQueriesOptions): UseGlobalQueries => {
  const statsQuery = useQuery({
    ...globalStatsQueryOptions(),
    enabled: Boolean(stats),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const usagesQuery = useQuery({
    ...globalUsagesQueryOptions(),
    enabled: Boolean(usages),
    placeholderData: keepPreviousData,
    retry: false,
  });

  return {
    stats: statsQuery.data?.totals || null,
    isLoadingStats: statsQuery.isLoading,

    usages: usagesQuery.data?.totals || null,
    isLoadingUsages: usagesQuery.isLoading,
  };
};
