import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { PaletteSortMode } from '@/consts/paletteSortModes';
import { useGlobalQueries } from '@/hooks/useGlobalQueries';
import { useSettingsStore } from '@/stores/stores';
import { type Palette } from '@/types/Palette';

export interface PaletteSortOption {
  label: string;
  value: PaletteSortMode;
}

interface UsePaletteSort {
  sortPalettes: PaletteSortMode;
  setSortPalettes: (mode: PaletteSortMode) => void;
  paletteSortOptions: PaletteSortOption[];
  paletteUsages: Map<string, number>;
  sortFn: (p1: Palette, p2: Palette) => number;
}

const usePaletteSort = (): UsePaletteSort => {
  const { sortPalettes, setSortPalettes } = useSettingsStore();
  const { usages } = useGlobalQueries({ usages: true });
  const t = useTranslations('usePaletteSort');

  const paletteSortOptions: PaletteSortOption[] = useMemo(() => ([
    {
      label: t('defaultAsc'),
      value: PaletteSortMode.DEFAULT_ASC,
    },
    {
      label: t('defaultDesc'),
      value: PaletteSortMode.DEFAULT_DESC,
    },
    {
      label: t('usageAsc'),
      value: PaletteSortMode.USAGE_ASC,
    },
    {
      label: t('usageDesc'),
      value: PaletteSortMode.USAGE_DESC,
    },
    {
      label: t('nameAsc'),
      value: PaletteSortMode.NAME_ASC,
    },
    {
      label: t('nameDesc'),
      value: PaletteSortMode.NAME_DESC,
    },
  ]), [t]);

  const paletteUsages = useMemo(() => {
    if (!usages?.palettes) {
      return new Map();
    }

    return new Map(usages?.palettes.map(({ shortName, usage }) => ([shortName, usage])));
  }, [usages?.palettes]);

  const sortFn = useCallback((p1: Palette, p2: Palette) => {
    const [what, direction] = sortPalettes.split('_');
    const dir = direction === 'asc' ? 1 : -1;

    switch (what) {
      case 'usage': {

        const u1 = paletteUsages?.get(p1.shortName) ?? 0;
        const u2 = paletteUsages?.get(p2.shortName) ?? 0;

        if (u1 < u2) {
          return dir * -1;
        }

        if (u1 > u2) {
          return dir;
        }

        return 0;
      }

      case 'name':
        return p1.name.localeCompare(p2.name) * dir;

      case 'default':
      default:
        return dir;
    }
  }, [paletteUsages, sortPalettes]);

  return {
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
    paletteUsages,
    sortFn,
  };
};

export default usePaletteSort;
