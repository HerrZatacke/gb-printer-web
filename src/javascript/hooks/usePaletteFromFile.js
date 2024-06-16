import kmeans from 'node-kmeans';
import chunk from 'chunk';
import quantize from 'quantize';
import { useDispatch } from 'react-redux';
import getImageData from '../tools/transformBitmaps/getImageData';
import { SET_PICK_COLORS } from '../app/store/actions';

export const toHexColor = ([r, g, b]) => ([
  '#',
  Math.min(0xff, Math.max(0, r)).toString(16).padStart(2, '0'),
  Math.min(0xff, Math.max(0, g)).toString(16).padStart(2, '0'),
  Math.min(0xff, Math.max(0, b)).toString(16).padStart(2, '0'),
].join(''));

const sortColor = (a, b) => {
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

const usePaletteFromFile = () => {
  const dispatch = useDispatch();

  const onInputChange = async ({ target }) => {
    if (target.files?.[0]) {
      const { imageData, fileName } = await getImageData(target.files[0], true);

      const pixels = chunk(imageData.data, 4);

      const image = pixels.map(([r, g, b]) => ([r, g, b]));

      kmeans.clusterize(image, { k: 6 }, (error, res) => {
        if (error) {
          console.error(error);
        } else {

          const colorMap = quantize(image, 4);

          const colors = [
            ...colorMap.palette(),
            ...res.map(({ centroid: [r, g, b] }) => [
              Math.round(r),
              Math.round(g),
              Math.round(b),
            ]),
          ]
            .filter((colFilter, index, self) => (
              self.findIndex((colFind) => (
                colFind.join(',') === colFilter.join(',')
              )) === index
            ))
            .sort(sortColor);

          dispatch({
            type: SET_PICK_COLORS,
            payload: {
              colors,
              fileName,
            },
          });
        }
      });
    }

    // eslint-disable-next-line no-param-reassign
    target.value = '';
  };

  return {
    onInputChange,
  };
};

export default usePaletteFromFile;
