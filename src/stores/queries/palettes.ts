import { getItemsSource } from '@/items/client';

const baseKeys = ['items', 'palettes'] as const;

export const paletteKeys = {
  all: baseKeys,
  list: [...baseKeys, 'list'] as const,
  byShortName: (shortNames: string[]) => [...baseKeys, 'byShortName', [...shortNames]] as const,
};

export const palettesListQueryOptions = () => {
  return {
    queryKey: paletteKeys.list,
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPalettes();
    },
  };
};

export const palettesByShortNameQueryOptions = (shortNames: string[]) => {
  return {
    queryKey: paletteKeys.byShortName(shortNames),
    queryFn: async () => {
      const source = await getItemsSource();
      return source.getPalettesByShortNames(shortNames || []);
    },
  };
};
