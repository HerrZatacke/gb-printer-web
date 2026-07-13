import { getItemsSource } from '@/items/client';

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
    staleTime: 30000,
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
    staleTime: 30000,
  };
};
