import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_PALETTE_SORT } from '../app/store/actions';

const usePaletteSort = () => {
  const { sortPalettes, images } = useSelector((state) => ({
    sortPalettes: state.sortPalettes,
    images: state.images,
  }));

  const dispatch = useDispatch();

  const paletteSortOptions = [
    {
      label: 'Default (ascending)',
      value: 'default_asc',
    },
    {
      label: 'Default (descending)',
      value: 'default_desc',
    },
    {
      label: 'Usage (ascending)',
      value: 'usage_asc',
    },
    {
      label: 'Usage (descending)',
      value: 'usage_desc',
    },
    {
      label: 'Name (ascending)',
      value: 'name_asc',
    },
    {
      label: 'Name (descending)',
      value: 'name_desc',
    },
  ];

  const setSortPalettes = (order) => {
    dispatch({
      type: SET_PALETTE_SORT,
      payload: order,
    });
  };

  const paletteUsages = useMemo(() => (
    images.reduce((acc, image) => {
      if (typeof image.palette !== 'string') {
        return acc;
      }

      // eslint-disable-next-line no-param-reassign
      acc[image.palette] = (acc[image.palette] || 0) + 1;

      return acc;
    }, {})
  ), [images]);

  const sortFn = useCallback((p1, p2) => {
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
