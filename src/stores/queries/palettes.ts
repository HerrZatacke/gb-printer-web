import { QueryClient } from '@tanstack/react-query';
import { getQueryClient } from '@/contexts/QueryClient';
import { getItemsSource } from '@/stores/items/client';
import { createBatchedLoader } from '@/stores/queries/batchedLoader';
import { palettesKeys } from '@/stores/queries/cacheKeys';
import { STALE_TIME } from '@/stores/queries/consts';
import { Palette } from '@/types/Palette';

const warmPaletteCache = (palettes: Palette[]) => {
  const queryClient = getQueryClient();
  palettes.forEach((palette) => {
    queryClient.setQueryData(palettesKeys.byShortName(palette.shortName), palette);
  });
};

export const palettesByShortNamesBatchedLoader = createBatchedLoader<Palette>(
  async (shortNames: string[]) => {
    const source = await getItemsSource();
    const response = await source.getPalettesByShortNames(shortNames);
    return {
      duration: response.duration,
      total: response.paging.total,
      items: response.items,
    };
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
