import dayjs from 'dayjs';
import { dateFormat, defaultRGBNPalette } from '../../defaults';
import { Actions } from '../actions';

const saveRGBNImage = (store) => (next) => (action) => {

  if (action.type === Actions.SAVE_RGBN_IMAGE) {

    const state = store.getState();

    import(/* webpackChunkName: "obh" */ 'object-hash')
      .then(({ default: hash }) => {
        const image = {
          palette: defaultRGBNPalette,
          hashes: { ...state.rgbnImages },
          hash: hash(state.rgbnImages),
          created: dayjs().format(dateFormat),
          title: '',
          tags: [],
        };

        store.dispatch({
          type: Actions.ADD_IMAGES,
          payload: [image],
        });
      });

  }

  next(action);
};

export default saveRGBNImage;
