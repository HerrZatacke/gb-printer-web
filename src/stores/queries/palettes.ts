import { QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/contexts/QueryClient';
import { getItemsSource } from '@/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { STALE_TIME } from '@/stores/queries/consts';
import { Palette } from '@/types/Palette';

const baseKeys = ['items', 'palettes'] as const;

export const palettesKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byShortName: (shortName: string) => [...baseKeys, 'byShortName', shortName] as const,
  byShortNames: (shortNames: string[]) => [...baseKeys, 'byShortNames', [...shortNames].sort()] as const,
};

const warmPaletteCache = (palettes: Palette[]) => {
  const queryClient = getQueryClient();
  palettes.forEach((palette) => {
    queryClient.setQueryData(palettesKeys.byShortName(palette.shortName), palette);
  });
};

export const palettesByShortNamesBatchedLoader = createBatchedLoader<Palette>(
  async (shortNames: string[]) => {
    const source = await getItemsSource();
    return source.getPalettesByShortNames(shortNames);
  },
  (palette) => palette.shortName,
  50,
);

export const palettesListQueryOptions = () => {
  return {
    queryKey: palettesKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      const result = await source.getPalettes();

      warmPaletteCache(result.items);
      return result;
    },
    staleTime: STALE_TIME,
  };
};

export const palettesByShortNamesQueryOptions = (shortNames: string[]) => {
  return {
    queryKey: palettesKeys.byShortNames(shortNames),
    queryFn: async () => {
      if (!shortNames?.length) {
        return { items: [] };
      }

      const results = await Promise.all(shortNames.map(palettesByShortNamesBatchedLoader.loadByKey));
      const items = results.filter((f): f is Palette => Boolean(f));

      warmPaletteCache(items);
      return { items };
    },
    select: (data: { items: Palette[] }) => {
      const byShortName = new Map(data.items.map((palette) => [palette.shortName, palette]));
      return {
        items: shortNames // sort result by this call's original order, not the cached one
          .map((shortName) => byShortName.get(shortName))
          .filter((palette): palette is Palette => Boolean(palette)),
      };
    },
    staleTime: STALE_TIME,
  };
};

export const paletteByShortNameQueryOptions = (shortName: string) => ({
  queryKey: palettesKeys.byShortName(shortName), // mostly populated by palettesByShortNames
  queryFn: async () => palettesByShortNamesBatchedLoader.loadByKey(shortName),
  staleTime: STALE_TIME,
});

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
