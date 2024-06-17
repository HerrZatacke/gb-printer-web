import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../app/store/actions';
import type { PaletteSetSortOrderAction } from '../../types/actions/PaletteActions';
import { PaletteSortMode } from '../consts/paletteSortModes';
import type { State } from '../app/store/State';
import type { Palette } from '../../types/Palette';
import { isRGBNImage } from '../tools/isRGBNImage';
import type { Image, MonochromeImage } from '../../types/Image';

export interface PaletteSortOption {
  label: string,
  value: PaletteSortMode,
}

type PaletteUsage = Record<string, number>;

interface UsePaletteSort {
  sortPalettes: PaletteSortMode,
  setSortPalettes: (mode: PaletteSortMode) => void,
  paletteSortOptions: PaletteSortOption[],
  paletteUsages: PaletteUsage,
  sortFn: (p1: Palette, p2: Palette) => number,
}

const usePaletteSort = (): UsePaletteSort => {
  const { sortPalettes, images } = useSelector((state: State) => ({
    sortPalettes: state.sortPalettes,
    images: state.images,
  }));

  const dispatch = useDispatch();

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

  const setSortPalettes = (sortMode: PaletteSortMode) => {
    dispatch<PaletteSetSortOrderAction>({
      type: Actions.SET_PALETTE_SORT,
      payload: sortMode,
    });
  };

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
