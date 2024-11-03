import type { ChangeEvent } from 'react';
import { useState } from 'react';
import kmeans from 'node-kmeans';
import type { RgbPixel } from 'quantize';
import quantize from 'quantize';
import chunk from 'chunk';
import { useDispatch } from 'react-redux';
import useInteractionsStore from '../app/stores/interactionsStore';
import getImageData from '../tools/transformBitmaps/getImageData';
import { Actions } from '../app/store/actions';
import type { SetPickColorsAction } from '../../types/actions/PickColorsActions';

export const toHexColor = ([r, g, b]: number[]): string => ([
  '#',
  Math.min(0xff, Math.max(0, r)).toString(16).padStart(2, '0'),
  Math.min(0xff, Math.max(0, g)).toString(16).padStart(2, '0'),
  Math.min(0xff, Math.max(0, b)).toString(16).padStart(2, '0'),
].join(''));

const sortColor = (a: number[], b: number[]): number => {
  const vA = (a[0] * 0.299) + (a[1] * 0.587) + (a[2] * 0.114);
  const vB = (b[0] * 0.299) + (b[1] * 0.587) + (b[2] * 0.114);

  if (vA > vB) {
    return -1;
  }

  if (vA < vB) {
    return 1;
  }

  return 0;
};

interface UsePaletteFromFile {
  onInputChange: (ev: ChangeEvent<HTMLInputElement>) => void,
  busy: boolean,
}

const usePaletteFromFile = (): UsePaletteFromFile => {
  const dispatch = useDispatch();
  const [busy, setBusy] = useState<boolean>(false);
  const { setError } = useInteractionsStore();

  const onInputChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files?.[0]) {
      setBusy(true);
      const { imageData, fileName } = await getImageData(target.files[0], true);

      const pixels = chunk(imageData.data, 4);

      const image = pixels.map(([r, g, b]): RgbPixel => ([r, g, b]));

      kmeans.clusterize(image, { k: 6 }, (error, res) => {
        if (error) {
          setError(error);
        } else {

          const colorMap = quantize(image, 4);

          const colors = [
            ...(colorMap ? colorMap.palette() : []),
            ...(res ? res.map(({ centroid: [r, g, b] }) => [
              Math.round(r),
              Math.round(g),
              Math.round(b),
            ]) : []),
          ]
            .filter((colFilter, index, self) => (
              self.findIndex((colFind) => (
                colFind.join(',') === colFilter.join(',')
              )) === index
            ))
            .sort(sortColor);

          dispatch<SetPickColorsAction>({
            type: Actions.SET_PICK_COLORS,
            payload: {
              colors,
              fileName,
            },
          });
        }

        setBusy(false);
      });
    }

    // eslint-disable-next-line no-param-reassign
    target.value = '';
  };

  return {
    onInputChange,
    busy,
  };
};

export default usePaletteFromFile;
