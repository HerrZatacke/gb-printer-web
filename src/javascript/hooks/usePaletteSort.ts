import { useCallback, useMemo } from 'react';
import { PaletteSortMode } from '../consts/paletteSortModes';
import type { Palette } from '../../types/Palette';
import { isRGBNImage } from '../tools/isRGBNImage';
import type { Image, MonochromeImage } from '../../types/Image';
import useSettingsStore from '../app/stores/settingsStore';
import useItemsStore from '../app/stores/itemsStore';
import type { MenuOption } from '../../types/MenuOption';

export type PaletteSortOption = MenuOption<PaletteSortMode>;

type PaletteUsage = Record<string, number>;

interface UsePaletteSort {
  sortPalettes: PaletteSortMode,
  setSortPalettes: (mode: PaletteSortMode) => void,
  paletteSortOptions: PaletteSortOption[],
  paletteUsages: PaletteUsage,
  sortFn: (p1: Palette, p2: Palette) => number,
}

const usePaletteSort = (): UsePaletteSort => {
  const { sortPalettes, setSortPalettes } = useSettingsStore();
  const { images } = useItemsStore();

  const paletteSortOptions: PaletteSortOption[] = [
    {
      label: 'Default (ascending)',
      value: PaletteSortMode.DEFAULT_ASC,
    },
    {
      label: 'Default (descending)',
      value: PaletteSortMode.DEFAULT_DESC,
    },
    {
      label: 'Usage (ascending)',
      value: PaletteSortMode.USAGE_ASC,
    },
    {
      label: 'Usage (descending)',
      value: PaletteSortMode.USAGE_DESC,
    },
    {
      label: 'Name (ascending)',
      value: PaletteSortMode.NAME_ASC,
    },
    {
      label: 'Name (descending)',
      value: PaletteSortMode.NAME_DESC,
    },
  ];

  const paletteUsages = useMemo(() => (
    images.reduce((acc: PaletteUsage, image: Image): PaletteUsage => {
      const imageIsRGBN = isRGBNImage(image);

      if (imageIsRGBN) {
        return acc;
      }

      return {
        ...acc,
        [(image as MonochromeImage).palette]: (acc[(image as MonochromeImage).palette] || 0) + 1,
      };
    }, {})
  ), [images]);

  const sortFn = useCallback((p1: Palette, p2: Palette) => {
    const [what, direction] = sortPalettes.split('_');
    const dir = direction === 'asc' ? 1 : -1;

    switch (what) {
      case 'usage': {

        const u1 = paletteUsages[p1.shortName] || 0;
        const u2 = paletteUsages[p2.shortName] || 0;

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
