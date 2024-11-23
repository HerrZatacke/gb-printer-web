import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useFiltersStore from '../app/stores/filtersStore';
import { dateFormat, defaultRGBNPalette } from '../app/defaults';
import { Actions } from '../app/store/actions';
import type { AddImagesAction } from '../../types/actions/ImageActions';
import type { RGBNHashes, RGBNImage } from '../../types/Image';

interface UseSaveRGBNImages {
  saveRGBNImage: (hashes: RGBNHashes[]) => Promise<void>,
}

const useSaveRGBNImages = (): UseSaveRGBNImages => {
  const dispatch = useDispatch();

  const saveRGBNImage = useCallback(async (hashes: RGBNHashes[]): Promise<void> => {
    const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

    const now = dayjs();

    const images = hashes.map((rgbnHashes: RGBNHashes, index: number): RGBNImage => {
      const image: RGBNImage = {
        palette: defaultRGBNPalette,
        hashes: rgbnHashes,
        hash: hash(rgbnHashes),
        created: now.add(index, 'milliseconds').format(dateFormat),
        title: '',
        tags: [],
      };

      return image;
    });

    dispatch<AddImagesAction>({
      type: Actions.ADD_IMAGES,
      payload: images,
    });

    const { setImageSelection } = useFiltersStore.getState();
    setImageSelection(images.map((i) => i.hash));
  }, [dispatch]);

  return { saveRGBNImage };
};

export default useSaveRGBNImages;
