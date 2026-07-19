import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getItemsSource } from '@/items/client';
import {
  palettesKeys,
  palettesByShortNameQueryOptions,
  palettesListQueryOptions,
} from '@/stores/queries/palettes';
import { Palette } from '@/types/Palette';
import { ItemsSourcePaging } from '@/workers/itemsIndexedDbWorker/types';

export interface UsePalettes {
  palettes: Palette[];
  paging: ItemsSourcePaging | null;
  isLoadingList: boolean;
  byShortNames: Palette[];
  isLoadingByShortNames: boolean;
  updatePalettes: (palettes: Palette[], purge?: boolean) => Promise<void>;
  deletePalettesByShortNames: (shortNames: string[]) => Promise<void>;
}

export interface UsePalettesOptions {
  list?: boolean;
  shortNames?: string[];
}

export const usePalettes = ({ list, shortNames }: UsePalettesOptions): UsePalettes => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    ...palettesListQueryOptions(),
    enabled: Boolean(list),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const byShortNamesQuery = useQuery({
    ...palettesByShortNameQueryOptions(shortNames || []),
    enabled: Boolean(shortNames?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updatePalettes = useCallback(async (palettes: Palette[], purge = false): Promise<void> => {
    const source = await getItemsSource();
    await source.updatePalettes(palettes, purge);
    await queryClient.invalidateQueries({ queryKey: palettesKeys.all });
  }, [queryClient]);

  const deletePalettesByShortNames = useCallback(async (deleteShortNames: string[]): Promise<void> => {
    const source = await getItemsSource();
    await source.deletePalettesByShortNames(deleteShortNames);
    await queryClient.invalidateQueries({ queryKey: palettesKeys.all });
  }, [queryClient]);

  return {
    palettes: listQuery.data?.items ?? [],
    paging: listQuery.data?.paging ?? null,
    isLoadingList: listQuery.isLoading,

    byShortNames: byShortNamesQuery.data?.items ?? [],
    isLoadingByShortNames: byShortNamesQuery.isLoading,

    updatePalettes,
    deletePalettesByShortNames,
  };
};
