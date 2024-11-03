import dayjs from 'dayjs';
import useFiltersStore from '../../stores/filtersStore';
import { dateFormat, defaultRGBNPalette } from '../../defaults';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { AddImagesAction } from '../../../../types/actions/ImageActions';
import type { RGBNHashes, RGBNImage } from '../../../../types/Image';

const saveRGBNImage: MiddlewareWithState = (store) => (next) => async (action) => {
  if (action.type === Actions.SAVE_NEW_RGB_IMAGES) {
    const hashes: RGBNHashes[] = action.payload;

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

    store.dispatch<AddImagesAction>({
      type: Actions.ADD_IMAGES,
      payload: images,
    });

    const { setImageSelection } = useFiltersStore.getState();
    setImageSelection(images.map((i) => i.hash));
  }

  next(action);
};

export default saveRGBNImage;
