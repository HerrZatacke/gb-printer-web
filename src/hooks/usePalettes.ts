import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import { Palette } from '@/types/Palette';

export interface UsePalettes {
  palettes: Palette[];
  totalCount: number;
  isLoadingList: boolean;
  byShortNames: Palette[];
  isLoadingByShortNames: boolean;
  updatePalettes: (palettes: Palette[]) => Promise<void>;
  deletePalettesByShortNames: (shortNames: string[]) => Promise<void>;
}

export interface UsePalettesOptions {
  list?: boolean;
  shortNames?: string[];
}

const baseKey = ['items', 'palettes'];

export const usePalettes = ({ list, shortNames }: UsePalettesOptions): UsePalettes => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...baseKey, 'list'],
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPalettes();
    },
    enabled: Boolean(list),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byShortNamesQuery = useQuery({
    queryKey: [...baseKey, 'byShortName', shortNames],
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPalettesByShortNames(shortNames || []);
    },
    enabled: Boolean(shortNames?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updatePalettes = useCallback(async (palettes: Palette[]): Promise<void> => {
    const source = await getItemsSource();
    await source.updatePalettes(palettes);
    queryClient.invalidateQueries({ queryKey: baseKey });
  }, [queryClient]);

  const deletePalettesByShortNames = useCallback(async (deleteShortNames: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deletePalettesByShortNames(deleteShortNames);
    queryClient.invalidateQueries({ queryKey: baseKey });
  }, [queryClient]);

  return {
    palettes: listQuery.data?.items ?? [],
    totalCount: listQuery.data?.paging?.total ?? 0,
    isLoadingList: listQuery.isLoading,

    byShortNames: byShortNamesQuery.data?.items ?? [],
    isLoadingByShortNames: byShortNamesQuery.isLoading,

    updatePalettes,
    deletePalettesByShortNames,
  };
};
