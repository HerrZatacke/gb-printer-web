import { QueryClient } from '@tanstack/react-query';
import { getItemsSource } from '@/items/client';
import { STALE_TIME } from '@/stores/queries/consts';
import { Palette } from '@/types/Palette';

const baseKeys = ['items', 'palettes'] as const;

export const palettesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byShortNames: (shortNames: string[]) => [...baseKeys, 'byShortNames', [...shortNames].sort()] as const,
};

export const palettesListQueryOptions = () => {
  return {
    queryKey: palettesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPalettes();
    },
    staleTime: STALE_TIME,
  };
};

// ToDo: add batched loader
export const palettesByShortNameQueryOptions = (shortNames: string[]) => {
  return {
    queryKey: palettesKeys.byShortNames(shortNames),
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPalettesByShortNames(shortNames || []);
    },
    staleTime: STALE_TIME,
  };
};

export const updatePalettesAction = async (queryClient: QueryClient, palettes: Palette[], purge = false): Promise<void> => {
  const source = await getItemsSource();
  await source.updatePalettes(palettes, purge);
  await queryClient.invalidateQueries({ queryKey: palettesKeys.all });
};

export const deletePalettesByShortNamesAction = async (queryClient: QueryClient, deleteShortNames: string[]): Promise<void> => {
  const source = await getItemsSource();
  await source.deletePalettesByShortNames(deleteShortNames);
  await queryClient.invalidateQueries({ queryKey: palettesKeys.all });
};
