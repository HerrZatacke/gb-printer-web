import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  palettesByShortNamesQueryOptions,
  palettesListQueryOptions,
  updatePalettesAction,
  deletePalettesByShortNamesAction,
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
    ...palettesByShortNamesQueryOptions(shortNames || []),
    enabled: Boolean(shortNames?.length),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const updatePalettes = useCallback(async (palettes: Palette[], purge = false): Promise<void> => {
    await updatePalettesAction(queryClient, palettes, purge);
  }, [queryClient]);

  const deletePalettesByShortNames = useCallback(async (deleteShortNames: string[]): Promise<void> => {
    await deletePalettesByShortNamesAction(queryClient, deleteShortNames);
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
