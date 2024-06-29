import dayjs from 'dayjs';
import { dateFormat, defaultRGBNPalette } from '../../defaults';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { AddImagesAction } from '../../../../types/actions/ImageActions';
import type { RGBNHashes, RGBNImage } from '../../../../types/Image';
import type { ImageSelectionSetAction } from '../../../../types/actions/ImageSelectionActions';

const saveRGBNImage: MiddlewareWithState = (store) => (next) => async (action) => {

  if (action.type === Actions.SAVE_RGBN_IMAGE) {

    const state = store.getState();

    const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

    const image: RGBNImage = {
      palette: defaultRGBNPalette,
      hashes: { ...state.rgbnImages },
      hash: hash(state.rgbnImages),
      created: dayjs().format(dateFormat),
      title: '',
      tags: [],
    };

    store.dispatch<AddImagesAction>({
      type: Actions.ADD_IMAGES,
      payload: [image],
    });

  }

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

    store.dispatch<ImageSelectionSetAction>({
      type: Actions.IMAGE_SELECTION_SET,
      payload: images.map((i) => i.hash),
    });
  }

  next(action);
};

export default saveRGBNImage;
