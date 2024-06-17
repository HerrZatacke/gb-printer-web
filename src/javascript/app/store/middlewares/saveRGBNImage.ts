import dayjs from 'dayjs';
import { dateFormat, defaultRGBNPalette } from '../../defaults';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { AddImagesAction } from '../../../../types/actions/ImageActions';

const saveRGBNImage: MiddlewareWithState = (store) => (next) => async (action) => {

  if (action.type === Actions.SAVE_RGBN_IMAGE) {

    const state = store.getState();

    const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');

    const image = {
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

  next(action);
};

export default saveRGBNImage;
